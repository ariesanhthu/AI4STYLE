import { ConfigService } from '@nestjs/config';
import { IStorageProvider, UploadResult } from '@/core/upload/interfaces/storage-provider.interface';
export declare class CloudinaryStorageProvider implements IStorageProvider {
    private readonly configService;
    private readonly logger;
    private readonly DEFAULT_FOLDER;
    constructor(configService: ConfigService);
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
    private mapToUploadResult;
    extractPublicIdFromUrl(url: string): string | null;
}
