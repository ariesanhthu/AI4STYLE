import { randomUUID } from 'crypto';
import { GetListImageDto } from '../dtos';
import {
  type IImageRepository,
  type IStorageProvider,
} from '@/core/upload/interfaces';
import { ImageEntity } from '@/core/upload/entities';
import { ILoggerService } from '@/shared/interfaces';
import {
  ImageDeletionFailedException,
  ImageNotFoundException,
  ImageUploadFailedException,
} from '@/core/upload/exceptions';

export class UploadService {
  constructor(
    private readonly imageRepository: IImageRepository,
    private readonly storageProvider: IStorageProvider,
    private readonly logger: ILoggerService,
  ) {
    this.logger.setContext(UploadService.name);
  }

  /**
   * Upload image to storage provider and save metadata to database
   */
  async uploadImage(file: Express.Multer.File, title: string): Promise<any> {
    try {
      // Upload to storage provider with time tracking
      const uploadResult = await this.storageProvider.upload(file.buffer);

      // Create image entity
      const imageEntity = new ImageEntity(
        randomUUID(),
        title,
        uploadResult.url,
        uploadResult.format,
        uploadResult.size,
        new Date(),
        new Date(),
      );

      // Save to database
      const savedImage = await this.imageRepository.create(imageEntity);

      this.logger.log(`Image uploaded successfully: ${savedImage.id}`);

      return savedImage.toJSON();
    } catch (error) {
      this.logger.error(
        `Failed to upload image: ${error.message}`,
        error.stack,
      );
      throw new ImageUploadFailedException(error.message);
    }
  }

  /**
   * Bulk upload images to storage provider and save metadata to database
   */
  async bulkUploadImages(
    files: Express.Multer.File[],
    titles: string[],
  ): Promise<any> {
    const startTime = Date.now();
    const results = {
      success: [] as any[],
      failed: [] as any[],
      totalTime: 0,
      storageTime: 0,
      databaseTime: 0,
    };

    try {
      this.logger.log(`Starting bulk upload of ${files.length} images`);

      // Upload all files to storage provider in parallel
      const storageStartTime = Date.now();
      const uploadPromises = files.map((file, index) =>
        this.storageProvider
          .upload(file.buffer)
          .then((response) => ({ success: true, response, index }))
          .catch((error) => ({ success: false, error, index })),
      );

      const uploadResults = await Promise.all(uploadPromises);
      const storageEndTime = Date.now();
      results.storageTime = storageEndTime - storageStartTime;

      this.logger.log(
        `Storage upload completed in ${results.storageTime}ms`,
      );

      // Process successful uploads and save to database
      const databaseStartTime = Date.now();
      const successfulUploads = uploadResults.filter((r) => r.success);

      const dbPromises = successfulUploads.map(async (upload: any) => {
        const index = upload.index;
        const title = titles[index] || `Image ${index + 1}`;

        try {
          const imageEntity = new ImageEntity(
            randomUUID(),
            title,
            upload.response.url,
            upload.response.format,
            upload.response.size,
            new Date(),
            new Date(),
          );

          const savedImage = await this.imageRepository.create(imageEntity);
          results.success.push({
            index,
            title,
            image: savedImage.toJSON(),
          });
        } catch (error) {
          results.failed.push({
            index,
            title,
            error: error.message,
            stage: 'database',
          });
        }
      });

      await Promise.all(dbPromises);
      const databaseEndTime = Date.now();
      results.databaseTime = databaseEndTime - databaseStartTime;

      // Process failed uploads
      uploadResults
        .filter((r) => !r.success)
        .forEach((upload: any) => {
          results.failed.push({
            index: upload.index,
            title: titles[upload.index] || `Image ${upload.index + 1}`,
            error: upload.error.message,
            stage: 'storage',
          });
        });

      results.totalTime = Date.now() - startTime;

      this.logger.log(
        `Bulk upload completed: ${results.success.length} succeeded, ${results.failed.length} failed`,
      );
      this.logger.log(
        `Time breakdown - Total: ${results.totalTime}ms, Storage: ${results.storageTime}ms, Database: ${results.databaseTime}ms`,
      );

      return results;
    } catch (error) {
      this.logger.error(`Bulk upload failed: ${error.message}`, error.stack);
      throw new ImageUploadFailedException(error.message);
    }
  }

  /**
   * Get image by ID
   */
  async getImageById(id: string): Promise<any> {
    try {
      const image = await this.imageRepository.findById(id);
      if (!image) {
        throw new ImageNotFoundException(id);
      }
      return image.toJSON();
    } catch (error) {
      this.logger.error(
        `Failed to get image by id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get list of images with pagination
   */
  async getListImages(query: GetListImageDto): Promise<any> {
    try {
      // Increment limit by 1 to check if there's a next page
      query.limit += 1;

      const images = await this.imageRepository.findAll(query);

      // Check if there's a next page
      const nextCursor =
        images.length === query.limit ? images[images.length - 1].id : null;

      // Remove extra item if it exists
      if (nextCursor) {
        images.pop();
      }

      return {
        items: images.map((image) => image.toJSON()),
        nextCursor,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get list of images: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Delete image from database and storage provider
   */
  async deleteImage(id: string): Promise<any> {
    const startTime = Date.now();

    try {
      const image = await this.imageRepository.findById(id);
      if (!image) {
        throw new ImageNotFoundException(id);
      }

      // Extract public_id from URL
      const publicId = this.extractPublicIdFromUrl(image.url);

      // Delete from storage provider if public_id is valid
      if (publicId) {
        const storageStartTime = Date.now();
        await this.storageProvider.delete(publicId);
        const storageDuration = Date.now() - storageStartTime;
        this.logger.log(
          `Deleted image from storage (${storageDuration}ms): ${publicId}`,
        );
      }

      // Delete from database
      const deleted = await this.imageRepository.delete(id);
      if (!deleted) {
        throw new ImageDeletionFailedException(
          `Failed to delete image with id ${id} from database`,
        );
      }

      const totalDuration = Date.now() - startTime;
      this.logger.log(`Image deleted successfully (${totalDuration}ms): ${id}`);

      return {
        success: true,
        message: 'Image deleted successfully',
        duration: totalDuration,
      };
    } catch (error) {
      this.logger.error(
        `Failed to delete image: ${error.message}`,
        error.stack,
      );
      if (error instanceof ImageNotFoundException) {
        throw error;
      }
      throw new ImageDeletionFailedException(error.message);
    }
  }

  /**
   * Bulk delete images from database and storage provider
   */
  async bulkDeleteImages(ids: string[]): Promise<any> {
    const startTime = Date.now();
    const results = {
      success: [] as string[],
      failed: [] as any[],
      totalTime: 0,
      storageTime: 0,
      databaseTime: 0,
    };

    try {
      this.logger.log(`Starting bulk delete of ${ids.length} images`);

      // Fetch all images
      const imagePromises = ids.map((id) =>
        this.imageRepository.findById(id).then((image) => ({ id, image })),
      );
      const imageResults = await Promise.all(imagePromises);

      // Separate found and not found
      const foundImages = imageResults.filter((r) => r.image !== null);
      const notFoundIds = imageResults
        .filter((r) => r.image === null)
        .map((r) => r.id);

      notFoundIds.forEach((id) => {
        results.failed.push({
          id,
          error: 'Image not found',
          stage: 'fetch',
        });
      });

      // Extract public IDs
      const publicIds = foundImages
        .map(({ image }) => this.extractPublicIdFromUrl(image!.url))
        .filter((id) => id !== null) as string[];

      // Delete from storage provider in parallel
      const storageStartTime = Date.now();
      const storageResults = await this.storageProvider.bulkDelete(publicIds);
      const storageEndTime = Date.now();
      results.storageTime = storageEndTime - storageStartTime;

      this.logger.log(
        `Storage deletion completed in ${results.storageTime}ms`,
      );

      // Track storage failures but continue with database deletion
      storageResults.failed.forEach(({ publicId, error }) => {
        this.logger.warn(`Storage deletion failed for ${publicId}: ${error}`);
      });

      // Delete from database in parallel
      const databaseStartTime = Date.now();
      const dbDeletePromises = foundImages.map(({ id }) =>
        this.imageRepository
          .delete(id)
          .then((success) => ({ success, id }))
          .catch((error) => ({ success: false, id, error: error.message })),
      );

      const dbResults = await Promise.all(dbDeletePromises);
      const databaseEndTime = Date.now();
      results.databaseTime = databaseEndTime - databaseStartTime;

      // Process database results
      dbResults.forEach((result) => {
        if (result.success) {
          results.success.push(result.id);
        } else {
          results.failed.push({
            id: result.id,
            error: (result as any).error,
            stage: 'database',
          });
        }
      });

      results.totalTime = Date.now() - startTime;

      this.logger.log(
        `Bulk delete completed: ${results.success.length} succeeded, ${results.failed.length} failed`,
      );
      this.logger.log(
        `Time breakdown - Total: ${results.totalTime}ms, Storage: ${results.storageTime}ms, Database: ${results.databaseTime}ms`,
      );

      return results;
    } catch (error) {
      this.logger.error(`Bulk delete failed: ${error.message}`, error.stack);
      throw new ImageDeletionFailedException(error.message);
    }
  }

  /**
   * Extract public_id from storage provider URL
   */
  private extractPublicIdFromUrl(url: string): string | null {
    try {
      // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{format}
      const urlParts = url.split('/');
      const uploadIndex = urlParts.indexOf('upload');

      if (uploadIndex === -1) return null;

      // Get the part after 'upload' and version
      const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');

      // Remove file extension
      const publicIdWithFolder = pathAfterUpload.substring(
        0,
        pathAfterUpload.lastIndexOf('.'),
      );

      return publicIdWithFolder;
    } catch (error) {
      this.logger.error(
        `Failed to extract public_id from URL: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }
}
