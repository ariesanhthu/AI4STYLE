export interface UploadResult {
    url: string;
    format: string;
    size: number;
    publicId?: string;
}
export interface IStorageProvider {
    upload(file: Buffer, options?: {
        folder?: string;
        filename?: string;
    }): Promise<UploadResult>;
    delete(publicId: string): Promise<boolean>;
    bulkDelete(publicIds: string[]): Promise<{
        success: string[];
        failed: Array<{
            publicId: string;
            error: string;
        }>;
    }>;
}
export declare const STORAGE_PROVIDER: unique symbol;
