import { Inject, Injectable, Logger } from "@nestjs/common";
import { randomUUID } from "crypto";
import type { ICategoryRepository } from "../repositories/category.repository.interface";
import { CategoryEntity } from "../category.entity";
import { CategoryValidationService } from "./category-validation.service";
import { ESortOrder } from "../../shared/enums";
import { CreateCategoryDto, UpdateCategoryDto } from "../dtos";
import { BadRequestError } from "passport-headerapikey";

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

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @Inject("CategoryRepository")
    private readonly categoryRepository: ICategoryRepository,
    private readonly validationService: CategoryValidationService,
  ) {}

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
      this.logger.error(`Failed to create category: ${error.message}`);
      throw new BadRequestError(`Failed to create category: ${error.message}`);
    }
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string) {
    try {
      const category = await this.categoryRepository.findById(id);
      if (!category) {
        throw new BadRequestError(`Category with id ${id} not found`);
      }
      return category.toJSON();
    } catch (error) {
      this.logger.error(`Failed to get category by id ${id}: ${error.message}`);
      throw new BadRequestError(`Failed to get category by id ${id}: ${error.message}`);
    }
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string) {
    try {
      const category = await this.categoryRepository.findBySlug(slug);
      if (!category) {
        throw new BadRequestError(`Category with slug '${slug}' not found`);
      }
      return category.toJSON();
    } catch (error) {
      this.logger.error(`Failed to get category by slug ${slug}: ${error.message}`);
      throw new BadRequestError(`Failed to get category by slug ${slug}: ${error.message}`);
    }
  }

  /**
   * Get full category tree (all categories organized hierarchically)
   */
  async getCategoryTree(): Promise<CategoryTreeNode[]> {
    try {
        
      this.logger.log("Building category tree from all categories");

      // Get all categories
      const allCategories = await this.categoryRepository.findAll({
        limit: 1000,
        cursor: null,
        sortOrder: ESortOrder.ASC,
      });
      // Build tree structure
      return this.buildTree(allCategories);
    } catch (error) {
      this.logger.error(`Failed to build category tree: ${error.message}`);
      throw new BadRequestError(`Failed to build category tree: ${error.message}`);
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
        dto.slug && dto.slug !== category.slug
        || dto.name && dto.name !== category.name
      ) {    
        await this.validationService.validateUnique(dto.slug ?? category.slug, dto.name ?? category.name);
      }

      // Validate parent change
      if (dto.parentId !== undefined && dto.parentId !== category.parentId) {
        await this.validationService.validateParentExists(dto.parentId);
        await this.validationService.validateNoCircularReference(id, dto.parentId);
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
        throw new Error(`Failed to update category with id ${id}`);
      }

      this.logger.log(`Category updated: ${id}`);
      return updated.toJSON();
    } catch (error) {
      this.logger.error(`Failed to update category with id ${id}: ${error.message}`);
      throw new BadRequestError(`Failed to update category with id ${id}: ${error.message}`);
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
        throw new Error(`Failed to delete category with id ${id}`);
      }

      this.logger.log(`Category deleted: ${id}`);
      return { success: true, message: "Category deleted successfully" };
    } catch (error) {
      this.logger.error(`Failed to delete category with id ${id}: ${error.message}`);
      throw new BadRequestError(`Failed to delete category with id ${id}: ${error.message}`);
    }
  }

  /**
   * Build tree structure from flat list of categories
   */
  private buildTree(categories: CategoryEntity[], targetId?: string): CategoryTreeNode[] {
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
          this.logger.warn(`Category ${cat.categoryId} has invalid parent ${cat.parentId}`);
          rootNodes.push(node);
        }
      }
    });

    return rootNodes;
  }
}
