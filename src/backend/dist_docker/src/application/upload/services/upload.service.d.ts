import { GetListImageDto } from '../dtos';
import { type IImageRepository, type IStorageProvider } from '@/core/upload/interfaces';
import { ILoggerService } from '@/shared/interfaces';
export declare class UploadService {
    private readonly imageRepository;
    private readonly storageProvider;
    private readonly logger;
    constructor(imageRepository: IImageRepository, storageProvider: IStorageProvider, logger: ILoggerService);
    uploadImage(file: Express.Multer.File, title: string): Promise<any>;
    bulkUploadImages(files: Express.Multer.File[], titles: string[]): Promise<any>;
    getImageById(id: string): Promise<any>;
    getListImages(query: GetListImageDto): Promise<any>;
    deleteImage(id: string): Promise<any>;
    bulkDeleteImages(ids: string[]): Promise<any>;
    private extractPublicIdFromUrl;
}
