import { ImageEntity } from '../entities';
export interface IImageRepository {
    create(newEntity: ImageEntity): Promise<ImageEntity>;
    findById(id: string): Promise<ImageEntity | null>;
    findAll(query: Record<string, any>): Promise<ImageEntity[]>;
    delete(id: string): Promise<boolean>;
    toEntity(raw: any): ImageEntity;
}
export declare const IMAGE_REPOSITORY: unique symbol;
