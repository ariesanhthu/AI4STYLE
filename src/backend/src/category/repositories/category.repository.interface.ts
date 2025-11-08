import { CategoryEntity } from "../category.entity";
import { PaginationCursorQueryDto } from "../../shared/dtos";
import { int } from "zod";

export interface CategoryJoinOptions {
  includeParent?: boolean;
}

export interface CategoryUniqueCheck {
  slug?: string;
  name?: string;
}

export interface ICategoryRepository {
  create(newEntity: CategoryEntity): Promise<CategoryEntity>;
  findById(id: string, options?: CategoryJoinOptions): Promise<CategoryEntity | null>;
  findBySlug(slug: string, options?: CategoryJoinOptions): Promise<CategoryEntity | null>;
  checkUnique(check: CategoryUniqueCheck): Promise<boolean>;
  findAll(query: PaginationCursorQueryDto, options?: CategoryJoinOptions): Promise<CategoryEntity[]>;
  update(updatedEntity: CategoryEntity): Promise<CategoryEntity | null>;
  delete(id: string): Promise<boolean>;
  toEntity(raw: any): CategoryEntity;
}
