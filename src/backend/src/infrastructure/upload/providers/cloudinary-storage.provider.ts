import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import {
  IStorageProvider,
  UploadResult,
} from '@/core/upload/interfaces/storage-provider.interface';

@Injectable()
export class CloudinaryStorageProvider implements IStorageProvider {
  private readonly logger = new Logger(CloudinaryStorageProvider.name);

  constructor(private readonly configService: ConfigService) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  /**
   * Upload file to Cloudinary
   */
  async upload(
    file: Buffer,
    options?: { folder?: string; filename?: string },
  ): Promise<UploadResult> {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options?.folder || 'hcmus/ai4style',
          resource_type: 'auto',
          public_id: options?.filename,
        },
        (error, result) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          if (error) {
            this.logger.error(
              `Cloudinary upload error (${duration}ms): ${error.message}`,
            );
            reject(error);
          } else if (result) {
            this.logger.log(
              `Cloudinary upload successful (${duration}ms): ${result.public_id}`,
            );
            resolve(this.mapToUploadResult(result));
          } else {
            this.logger.error(
              `Cloudinary upload error (${duration}ms): No result returned`,
            );
            reject(new Error('No result returned from Cloudinary'));
          }
        },
      );

      uploadStream.end(file);
    });
  }

  /**
   * Delete file from Cloudinary
   */
  async delete(publicId: string): Promise<boolean> {
    try {
      const startTime = Date.now();
      const result = await cloudinary.uploader.destroy(publicId);
      const duration = Date.now() - startTime;

      if (result.result === 'ok' || result.result === 'not found') {
        this.logger.log(
          `Deleted from Cloudinary (${duration}ms): ${publicId}`,
        );
        return true;
      }

      this.logger.warn(
        `Failed to delete from Cloudinary (${duration}ms): ${publicId}, result: ${result.result}`,
      );
      return false;
    } catch (error) {
      this.logger.error(
        `Error deleting from Cloudinary: ${publicId}, ${error.message}`,
      );
      return false;
    }
  }

  /**
   * Bulk delete files from Cloudinary
   */
  async bulkDelete(publicIds: string[]): Promise<{
    success: string[];
    failed: Array<{ publicId: string; error: string }>;
  }> {
    const startTime = Date.now();
    const results = {
      success: [] as string[],
      failed: [] as Array<{ publicId: string; error: string }>,
    };

    try {
      this.logger.log(`Starting bulk delete of ${publicIds.length} files from Cloudinary`);

      const deletePromises = publicIds.map((publicId) =>
        cloudinary.uploader
          .destroy(publicId)
          .then((result) => ({ success: result.result === 'ok' || result.result === 'not found', publicId }))
          .catch((error) => ({ success: false, publicId, error: error.message })),
      );

      const deleteResults = await Promise.all(deletePromises);

      deleteResults.forEach((result) => {
        if (result.success) {
          results.success.push(result.publicId);
        } else {
          results.failed.push({
            publicId: result.publicId,
            error: (result as any).error || 'Unknown error',
          });
        }
      });

      const duration = Date.now() - startTime;
      this.logger.log(
        `Bulk delete completed (${duration}ms): ${results.success.length} succeeded, ${results.failed.length} failed`,
      );

      return results;
    } catch (error) {
      this.logger.error(`Bulk delete failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Map Cloudinary response to UploadResult
   */
  private mapToUploadResult(result: UploadApiResponse): UploadResult {
    return {
      url: result.secure_url,
      format: result.format,
      size: result.bytes,
      publicId: result.public_id,
    };
  }

  /**
   * Extract Cloudinary public_id from URL
   */
  extractPublicIdFromUrl(url: string): string | null {
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
      );
      return null;
    }
  }
}
