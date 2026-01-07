import { BaseCategoryController } from './base-category.controller';
import { CategoryService } from '@/application/category/services';
export declare class CategoryClientController extends BaseCategoryController {
    protected readonly categoryService: CategoryService;
    constructor(categoryService: CategoryService);
}
