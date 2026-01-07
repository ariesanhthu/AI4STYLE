import { CategoryService } from '@/application/category/services';
export declare abstract class BaseCategoryController {
    protected readonly categoryService: CategoryService;
    constructor(categoryService: CategoryService);
    getAllCategoriesInTreeFormat(): Promise<import("@/application/category/services").CategoryTreeNode[]>;
    getCategoryById(id: string): Promise<any>;
    getCategoriesBySlug(slug: string): Promise<any>;
}
