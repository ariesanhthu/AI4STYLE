import { CategoryEntity } from '@/core/category/entities';
import { type ICategoryRepository } from '@/core/category/interfaces';
import { ILoggerService } from '@/shared/interfaces';
export declare class CategoryValidationService {
    private readonly categoryRepository;
    private readonly logger;
    constructor(categoryRepository: ICategoryRepository, logger: ILoggerService);
    validateCategoryExists(id: string): Promise<CategoryEntity>;
    validateUnique(slug?: string, name?: string, excludedId?: string): Promise<void>;
    validateParentExists(parentId: string | null): Promise<CategoryEntity | null>;
    validateNoCircularReference(categoryId: string, newParentId: string | null): Promise<void>;
    validateNoChildren(categoryId: string): Promise<void>;
    private isDescendantOf;
    validateNoProductsInCategory(categoryId: string): Promise<void>;
}
