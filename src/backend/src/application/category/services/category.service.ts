import { randomUUID } from 'crypto';
import { CategoryValidationService } from './category-validation.service';
import { type ICategoryRepository } from '@/core/category/interfaces';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { CategoryEntity } from '@/core/category/entities';
import { ESortOrder } from '@/shared/enums';
import { ILoggerService } from '@/shared/interfaces';
import {
  CategoryCircularReferenceException,
  CategoryHasChildrenException,
  CategoryHasProductsException,
  CategoryNotFoundException,
  CategorySlugAlreadyExistsException,
} from '@/core/category/exceptions';
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

export class CategoryService {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly validationService: CategoryValidationService,
    private readonly logger: ILoggerService,
  ) {
    this.logger.setContext(CategoryService.name);
  }

  /**
   * Create a new category
   */
  async createCategory(dto: CreateCategoryDto) {
    try {
      // Validate unique fields
      await this.validationService.validateUnique(dto.slug, dto.name);

      // Validate parent exists if provided
      if (dto.parentId) {
        await this.validationService.validateParentExists(dto.parentId);
      }

      const categoryEntity = new CategoryEntity(
        randomUUID(),
        dto.parentId ?? null,
        dto.name,
        dto.slug,
        dto.icon ?? null,
        dto.description ?? null,
        new Date(),
        new Date(),
      );

      const created = await this.categoryRepository.create(categoryEntity);
      this.logger.log(`Category created: ${created.categoryId}`);

      return created.toJSON();
    } catch (error) {
      this.logger.error(
        `Failed to create category: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string) {
    try {
      const category = await this.categoryRepository.findById(id);
      if (!category) {
        throw new CategoryNotFoundException(id);
      }
      return category.toJSON();
    } catch (error) {
      this.logger.error(
        `Failed to get category by id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string) {
    try {
      const category = await this.categoryRepository.findBySlug(slug);
      if (!category) {
        throw new CategoryNotFoundException(slug);
      }
      return category.toJSON();
    } catch (error) {
      this.logger.error(
        `Failed to get category by slug ${slug}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get full category tree (all categories organized hierarchically)
   */
  async getCategoryTree(): Promise<CategoryTreeNode[]> {
    try {
      this.logger.log('Building category tree from all categories');

      // Get all categories
      const allCategories = await this.categoryRepository.findAll({
        limit: 1000,
        cursor: null,
        sortOrder: ESortOrder.ASC,
      });
      // Build tree structure
      return this.buildTree(allCategories);
    } catch (error) {
      this.logger.error(
        `Failed to build category tree: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getListCategory(query: GetListCategoryDto) {
    try {
      const categories = await this.categoryRepository.findAll(query);
      const nextCursor =
        categories.length === query.limit
          ? categories[categories.length - 1].categoryId
          : null;
      if (nextCursor) {
        categories.pop();
      }
      return {
        items: categories.map((category) => category.toJSON()),
        nextCursor,
      };     
      
    } catch (error) {
      this.logger.error(
        `Failed to get list category: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Update category
   */
  async updateCategory(id: string, dto: UpdateCategoryDto) {
    try {
      const category = await this.validationService.validateCategoryExists(id);

      // Validate unique fields if changed
      if (
        (dto.slug && dto.slug !== category.slug) ||
        (dto.name && dto.name !== category.name)
      ) {
        await this.validationService.validateUnique(
          dto.slug ?? category.slug,
          dto.name ?? category.name,
        );
      }

      // Validate parent change
      if (dto.parentId !== undefined && dto.parentId !== category.parentId) {
        await this.validationService.validateParentExists(dto.parentId);
        await this.validationService.validateNoCircularReference(
          id,
          dto.parentId,
        );
      }

      // Update entity
      if (dto.name) category.name = dto.name;
      if (dto.slug) category.slug = dto.slug;
      if (dto.parentId !== undefined) category.parentId = dto.parentId;
      if (dto.icon !== undefined) category.icon = dto.icon;
      if (dto.description !== undefined) category.description = dto.description;
      category.updatedAt = new Date();

      const updated = await this.categoryRepository.update(category);
      if (!updated) {
        throw new CategoryNotFoundException(id);
      }

      this.logger.log(`Category updated: ${id}`);
      return updated.toJSON();
    } catch (error) {
      this.logger.error(
        `Failed to update category with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Delete category (only if it has no children)
   */
  async deleteCategory(id: string) {
    try {
      await this.validationService.validateCategoryExists(id);
      await this.validationService.validateNoChildren(id);
      await this.validationService.validateNoProductsInCategory(id);

      const deleted = await this.categoryRepository.delete(id);
      if (!deleted) {
        throw new CategoryNotFoundException(id);
      }

      this.logger.log(`Category deleted: ${id}`);
      return { success: true, message: 'Category deleted successfully' };
    } catch (error) {
      this.logger.error(
        `Failed to delete category with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Build tree structure from flat list of categories
   */
  private buildTree(
    categories: CategoryEntity[],
    targetId?: string,
  ): CategoryTreeNode[] {
    const categoryMap = new Map<string, CategoryTreeNode>();
    const rootNodes: CategoryTreeNode[] = [];

    // First pass: Create all nodes
    categories.forEach((cat) => {
      categoryMap.set(cat.categoryId, {
        categoryId: cat.categoryId,
        parentId: cat.parentId,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        description: cat.description,
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt,
        childrens: [],
      });
    });

    // Second pass: Link children to parents
    categories.forEach((cat) => {
      const node = categoryMap.get(cat.categoryId)!;

      if (cat.parentId === null) {
        rootNodes.push(node);
      } else {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.childrens.push(node);
        } else {
          // Orphaned category (parent doesn't exist), treat as root
          this.logger.warn(
            `Category ${cat.categoryId} has invalid parent ${cat.parentId}`,
          );
          rootNodes.push(node);
        }
      }
    });

    return rootNodes;
  }
}
