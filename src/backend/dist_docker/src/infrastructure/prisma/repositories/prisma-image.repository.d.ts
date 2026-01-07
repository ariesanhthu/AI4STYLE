import { ImageEntity } from '@/core/upload/entities';
import { IImageRepository } from '@/core/upload/interfaces';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { PaginationCursorQueryDto } from '@/shared/dtos';
export declare class PrismaImageRepository implements IImageRepository {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(newEntity: ImageEntity): Promise<ImageEntity>;
    findById(id: string): Promise<ImageEntity | null>;
    findAll(query: PaginationCursorQueryDto): Promise<ImageEntity[]>;
    delete(id: string): Promise<boolean>;
    toEntity(raw: any): ImageEntity;
}
