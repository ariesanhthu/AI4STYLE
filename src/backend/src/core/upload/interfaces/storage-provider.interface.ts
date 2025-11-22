export interface UploadResult {
  url: string;
  format: string;
  size: number;
  publicId?: string;
}

export interface IStorageProvider {
  /**
   * Upload a file to the storage provider
   * @param file - The file buffer to upload
   * @param options - Optional configuration for the upload
   * @returns Upload result containing URL, format, and size
   */
  upload(
    file: Buffer,
    options?: {
      folder?: string;
      filename?: string;
    },
  ): Promise<UploadResult>;

  /**
   * Delete a file from the storage provider
   * @param publicId - The public ID or identifier of the file to delete
   * @returns Success status
   */
  delete(publicId: string): Promise<boolean>;

  /**
   * Bulk delete files from the storage provider
   * @param publicIds - Array of public IDs to delete
   * @returns Results of deletion operations
   */
  bulkDelete(publicIds: string[]): Promise<{
    success: string[];
    failed: Array<{ publicId: string; error: string }>;
  }>;
}

export const STORAGE_PROVIDER = Symbol('IStorageProvider');
