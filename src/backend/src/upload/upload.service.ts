import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { randomUUID } from "crypto";
import { ImageEntity } from "./image.entity";
import type { IImageRepository } from "./repositories/image.interface.repository";
import { GetListImageDto } from "./dtos";

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    @Inject("ImageRepository")
    private readonly imageRepository: IImageRepository,
    private readonly configService: ConfigService,
  ) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get<string>("CLOUDINARY_CLOUD_NAME"),
      api_key: this.configService.get<string>("CLOUDINARY_API_KEY"),
      api_secret: this.configService.get<string>("CLOUDINARY_API_SECRET"),
    });
  }

  /**
   * Upload image to Cloudinary and save metadata to database
   */
  async uploadImage(
    file: Express.Multer.File,
    title: string,
  ): Promise<any> {
    try {
      // Upload to Cloudinary with time tracking
      const cloudinaryResponse = await this.uploadToCloudinary(file);

      // Create image entity
      const imageEntity = new ImageEntity(
        randomUUID(),
        title,
        cloudinaryResponse.secure_url,
        cloudinaryResponse.format,
        cloudinaryResponse.bytes,
        new Date(),
        new Date(),
      );

      // Save to database
      const savedImage = await this.imageRepository.create(imageEntity);
      
      this.logger.log(`Image uploaded successfully: ${savedImage.id}`);
      
      return savedImage.toJSON();
    } catch (error) {
      this.logger.error(`Failed to upload image: ${error.message}`);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Bulk upload images to Cloudinary and save metadata to database
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
      cloudinaryTime: 0,
      databaseTime: 0,
    };

    try {
      this.logger.log(`Starting bulk upload of ${files.length} images`);

      // Upload all files to Cloudinary in parallel
      const cloudinaryStartTime = Date.now();
      const uploadPromises = files.map((file, index) => 
        this.uploadToCloudinary(file)
          .then(response => ({ success: true, response, index }))
          .catch(error => ({ success: false, error, index }))
      );

      const uploadResults = await Promise.all(uploadPromises);
      const cloudinaryEndTime = Date.now();
      results.cloudinaryTime = cloudinaryEndTime - cloudinaryStartTime;
      
      this.logger.log(`Cloudinary upload completed in ${results.cloudinaryTime}ms`);

      // Process successful uploads and save to database
      const databaseStartTime = Date.now();
      const successfulUploads = uploadResults.filter(r => r.success);
      
      const dbPromises = successfulUploads.map(async (upload: any) => {
        const index = upload.index;
        const title = titles[index] || `Image ${index + 1}`;
        
        try {
          const imageEntity = new ImageEntity(
            randomUUID(),
            title,
            upload.response.secure_url,
            upload.response.format,
            upload.response.bytes,
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
        .filter(r => !r.success)
        .forEach((upload: any) => {
          results.failed.push({
            index: upload.index,
            title: titles[upload.index] || `Image ${upload.index + 1}`,
            error: upload.error.message,
            stage: 'cloudinary',
          });
        });

      results.totalTime = Date.now() - startTime;

      this.logger.log(`Bulk upload completed: ${results.success.length} succeeded, ${results.failed.length} failed`);
      this.logger.log(`Time breakdown - Total: ${results.totalTime}ms, Cloudinary: ${results.cloudinaryTime}ms, Database: ${results.databaseTime}ms`);

      return results;
    } catch (error) {
      this.logger.error(`Bulk upload failed: ${error.message}`);
      throw new Error(`Bulk upload failed: ${error.message}`);
    }
  }

  /**
   * Upload file to Cloudinary
   */
  private async uploadToCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "hcmus/ai4style",
          resource_type: "auto",
        },
        (error, result) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          
          if (error) {
            this.logger.error(`Cloudinary upload error (${duration}ms): ${error.message}`);
            reject(error);
          } else if (result) {
            this.logger.log(`Cloudinary upload successful (${duration}ms): ${result.public_id}`);
            resolve(result as UploadApiResponse);
          } else {
            this.logger.error(`Cloudinary upload error (${duration}ms): No result returned`);
            reject(new Error('No result returned from Cloudinary'));
          }
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  /**
   * Get image by ID
   */
  async getImageById(id: string): Promise<any> {
    const image = await this.imageRepository.findById(id);
    if (!image) {
      throw new Error(`Image with id ${id} not found`);
    }
    return image.toJSON();
  }

  /**
   * Get list of images with pagination
   */
  async getListImages(query: GetListImageDto): Promise<any> {
    // Increment limit by 1 to check if there's a next page
    query.limit += 1;
    
    const images = await this.imageRepository.findAll(query);
    
    // Check if there's a next page
    const nextCursor = images.length === query.limit
      ? images[images.length - 1].id
      : null;
    
    // Remove extra item if it exists
    if (nextCursor) {
      images.pop();
    }

    return {
      items: images.map((image) => image.toJSON()),
      nextCursor,
    };
  }

  /**
   * Delete image from database and Cloudinary
   */
  async deleteImage(id: string): Promise<any> {
    const startTime = Date.now();
    
    try {
      const image = await this.imageRepository.findById(id);
      if (!image) {
        throw new Error(`Image with id ${id} not found`);
      }

      // Extract public_id from Cloudinary URL
      const publicId = this.extractPublicIdFromUrl(image.url);
      
      // Delete from Cloudinary if public_id is valid
      if (publicId) {
        const cloudinaryStartTime = Date.now();
        await cloudinary.uploader.destroy(publicId);
        const cloudinaryDuration = Date.now() - cloudinaryStartTime;
        this.logger.log(`Deleted image from Cloudinary (${cloudinaryDuration}ms): ${publicId}`);
      }

      // Delete from database
      const deleted = await this.imageRepository.delete(id);
      if (!deleted) {
        throw new Error(`Failed to delete image with id ${id} from database`);
      }

      const totalDuration = Date.now() - startTime;
      this.logger.log(`Image deleted successfully (${totalDuration}ms): ${id}`);
      
      return { success: true, message: "Image deleted successfully", duration: totalDuration };
    } catch (error) {
      this.logger.error(`Failed to delete image: ${error.message}`);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  /**
   * Bulk delete images from database and Cloudinary
   */
  async bulkDeleteImages(ids: string[]): Promise<any> {
    const startTime = Date.now();
    const results = {
      success: [] as string[],
      failed: [] as any[],
      totalTime: 0,
      cloudinaryTime: 0,
      databaseTime: 0,
    };

    try {
      this.logger.log(`Starting bulk delete of ${ids.length} images`);

      // Fetch all images
      const imagePromises = ids.map(id => 
        this.imageRepository.findById(id)
          .then(image => ({ id, image }))
      );
      const imageResults = await Promise.all(imagePromises);

      // Separate found and not found
      const foundImages = imageResults.filter(r => r.image !== null);
      const notFoundIds = imageResults.filter(r => r.image === null).map(r => r.id);

      notFoundIds.forEach(id => {
        results.failed.push({
          id,
          error: 'Image not found',
          stage: 'fetch',
        });
      });

      // Delete from Cloudinary in parallel
      const cloudinaryStartTime = Date.now();
      const cloudinaryDeletePromises = foundImages.map(({ id, image }) => {
        const publicId = this.extractPublicIdFromUrl(image!.url);
        if (publicId) {
          return cloudinary.uploader.destroy(publicId)
            .then(() => ({ success: true, id }))
            .catch(error => ({ success: false, id, error: error.message }));
        }
        return Promise.resolve({ success: true, id });
      });

      const cloudinaryResults = await Promise.all(cloudinaryDeletePromises);
      const cloudinaryEndTime = Date.now();
      results.cloudinaryTime = cloudinaryEndTime - cloudinaryStartTime;

      this.logger.log(`Cloudinary deletion completed in ${results.cloudinaryTime}ms`);

      // Track Cloudinary failures but continue with database deletion
      const cloudinaryFailed = cloudinaryResults.filter(r => !r.success);
      cloudinaryFailed.forEach(({ id, error }: any) => {
        this.logger.warn(`Cloudinary deletion failed for ${id}: ${error}`);
      });

      // Delete from database in parallel
      const databaseStartTime = Date.now();
      const dbDeletePromises = foundImages.map(({ id }) =>
        this.imageRepository.delete(id)
          .then(success => ({ success, id }))
          .catch(error => ({ success: false, id, error: error.message }))
      );

      const dbResults = await Promise.all(dbDeletePromises);
      const databaseEndTime = Date.now();
      results.databaseTime = databaseEndTime - databaseStartTime;

      // Process database results
      dbResults.forEach(result => {
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

      this.logger.log(`Bulk delete completed: ${results.success.length} succeeded, ${results.failed.length} failed`);
      this.logger.log(`Time breakdown - Total: ${results.totalTime}ms, Cloudinary: ${results.cloudinaryTime}ms, Database: ${results.databaseTime}ms`);

      return results;
    } catch (error) {
      this.logger.error(`Bulk delete failed: ${error.message}`);
      throw new Error(`Bulk delete failed: ${error.message}`);
    }
  }

  /**
   * Extract Cloudinary public_id from URL
   */
  private extractPublicIdFromUrl(url: string): string | null {
    try {
      // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{format}
      const urlParts = url.split("/");
      const uploadIndex = urlParts.indexOf("upload");
      
      if (uploadIndex === -1) return null;
      
      // Get the part after 'upload' and version
      const pathAfterUpload = urlParts.slice(uploadIndex + 2).join("/");
      
      // Remove file extension
      const publicIdWithFolder = pathAfterUpload.substring(0, pathAfterUpload.lastIndexOf("."));
      
      return publicIdWithFolder;
    } catch (error) {
      this.logger.error(`Failed to extract public_id from URL: ${error.message}`);
      return null;
    }
  }
}
