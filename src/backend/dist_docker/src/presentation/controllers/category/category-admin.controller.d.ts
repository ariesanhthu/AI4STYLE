import { type CreateCategoryDto, type UpdateCategoryDto } from '@/application/category/dtos';
import { BaseCategoryController } from './base-category.controller';
import { CategoryService } from '@/application/category/services';
import { type GetListCategoryDto } from '@/application/category/dtos/get-list-category.dto';
export declare class CategoryAdminController extends BaseCategoryController {
    protected readonly categoryService: CategoryService;
    constructor(categoryService: CategoryService);
    createCategory(createCategoryDto: CreateCategoryDto): Promise<any>;
    getAllCategories(query: GetListCategoryDto): Promise<{
        items: any[];
        nextCursor: string | null;
    }>;
    updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<any>;
    deleteCategory(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
