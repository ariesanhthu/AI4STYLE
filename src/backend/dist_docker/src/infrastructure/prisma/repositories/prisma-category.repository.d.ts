import { ICategoryJoinOptions, ICategoryRepository, ICategoryUniqueCheck } from '@/core/category/interfaces';
import { GetListCategoryDto } from '@/application/category/dtos';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { CategoryEntity } from '@/core/category/entities';
export declare class PrismaCategoryRepository implements ICategoryRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(newEntity: CategoryEntity): Promise<CategoryEntity>;
    findById(id: string, options?: ICategoryJoinOptions): Promise<CategoryEntity | null>;
    findBySlug(slug: string, options?: ICategoryJoinOptions): Promise<CategoryEntity | null>;
    checkUnique(check: ICategoryUniqueCheck): Promise<boolean>;
    findAll(query: GetListCategoryDto, options?: ICategoryJoinOptions): Promise<CategoryEntity[]>;
    update(updatedEntity: CategoryEntity): Promise<CategoryEntity | null>;
    delete(id: string): Promise<boolean>;
    toEntity(raw: any): CategoryEntity;
}
