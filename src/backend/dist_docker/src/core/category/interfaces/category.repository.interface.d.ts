import { CategoryEntity } from '../entities';
export interface ICategoryJoinOptions {
    includeParent?: boolean;
}
export interface ICategoryUniqueCheck {
    slug?: string;
    name?: string;
    excludedId?: string;
}
export interface ICategoryRepository {
    create(newEntity: CategoryEntity): Promise<CategoryEntity>;
    findById(id: string, options?: ICategoryJoinOptions): Promise<CategoryEntity | null>;
    findBySlug(slug: string, options?: ICategoryJoinOptions): Promise<CategoryEntity | null>;
    checkUnique(check: ICategoryUniqueCheck): Promise<boolean>;
    findAll(query: Record<string, any>, options?: ICategoryJoinOptions): Promise<CategoryEntity[]>;
    update(updatedEntity: CategoryEntity): Promise<CategoryEntity | null>;
    delete(id: string): Promise<boolean>;
    toEntity(raw: any): CategoryEntity;
}
export declare const CATEGORY_REPOSITORY: unique symbol;
