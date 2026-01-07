import { CategoryValidationService } from './category-validation.service';
import { type ICategoryRepository } from '@/core/category/interfaces';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { ILoggerService } from '@/shared/interfaces';
import { GetListCategoryDto } from '../dtos/get-list-category.dto';
export interface CategoryTreeNode {
    categoryId: string;
    parentId: string | null;
    name: string;
    slug: string;
    icon: string | null;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    childrens: CategoryTreeNode[];
}
export declare class CategoryService {
    private readonly categoryRepository;
    private readonly validationService;
    private readonly logger;
    constructor(categoryRepository: ICategoryRepository, validationService: CategoryValidationService, logger: ILoggerService);
    createCategory(dto: CreateCategoryDto): Promise<any>;
    getCategoryById(id: string): Promise<any>;
    getCategoryBySlug(slug: string): Promise<any>;
    getCategoryTree(): Promise<CategoryTreeNode[]>;
    getListCategory(query: GetListCategoryDto): Promise<{
        items: any[];
        nextCursor: string | null;
    }>;
    updateCategory(id: string, dto: UpdateCategoryDto): Promise<any>;
    deleteCategory(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private buildTree;
}
