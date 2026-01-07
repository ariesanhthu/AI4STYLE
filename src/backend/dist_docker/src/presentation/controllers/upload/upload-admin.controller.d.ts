import { UploadService } from '@/application/upload/services/upload.service';
import { type GetListImageDto, type BulkDeleteImageDto } from '@/application/upload/dtos';
export declare class UploadAdminController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadImage(file: Express.Multer.File, title: string): Promise<any>;
    bulkUploadImages(files: Express.Multer.File[], titlesString?: string): Promise<any>;
    getListImages(query: GetListImageDto): Promise<any>;
    getImageById(id: string): Promise<any>;
    deleteImage(id: string): Promise<any>;
    bulkDeleteImages(body: BulkDeleteImageDto): Promise<any>;
}
