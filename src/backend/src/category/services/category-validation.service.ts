import { Inject, Injectable, Logger } from "@nestjs/common";
import type { ICategoryRepository } from "../repositories/category.repository.interface";
import { CategoryEntity } from "../category.entity";
import { ESortOrder } from "../../shared/enums";

@Injectable()
export class CategoryValidationService {
  private readonly logger = new Logger(CategoryValidationService.name);

  constructor(
    @Inject("CategoryRepository")
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  /**
   * Check if category exists by ID
   */
  async validateCategoryExists(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }
    return category;
  }

  /**
   * Check if slug is unique (excluding current category on update)
   */
  async validateUnique(slug: string, name: string): Promise<void> {
    const isUnique = await this.categoryRepository.checkUnique({ slug, name });
    if (!isUnique) {
      throw new Error(`Detected duplicate category with slug '${slug}' and name '${name}'`);
    }
  }

  /**
   * Validate parent exists if parentId is provided
   */
  async validateParentExists(parentId: string | null): Promise<CategoryEntity | null> {
    if (!parentId) {
      return null;
    }

    const parent = await this.categoryRepository.findById(parentId);
    if (!parent) {
      throw new Error(`Parent category with id ${parentId} not found`);
    }
    return parent;
  }

  /**
   * Check for circular reference when updating parent
   * Prevents: Category A -> B -> C -> A (circular)
   */
  async validateNoCircularReference(
    categoryId: string,
    newParentId: string | null,
  ): Promise<void> {
    if (!newParentId) {
      return; // No parent means no circular reference
    }

    if (categoryId === newParentId) {
      throw new Error("Category cannot be its own parent");
    }

    // Get all categories to build the tree
    const allCategories = await this.categoryRepository.findAll(
      { limit: 1000, cursor: null, sortOrder: ESortOrder.ASC },
    );

    // Check if newParentId is a descendant of categoryId
    const isDescendant = this.isDescendantOf(
      newParentId,
      categoryId,
      allCategories,
    );

    if (isDescendant) {
      throw new Error(
        "Circular reference detected: Cannot set a descendant as parent",
      );
    }
  }

  /**
   * Check if category has children (useful before deletion)
   */
  async validateNoChildren(categoryId: string): Promise<void> {
    const allCategories = await this.categoryRepository.findAll(
      { limit: 1000, cursor: null, sortOrder: ESortOrder.ASC },
    );

    const hasChildren = allCategories.some(
      (cat) => cat.parentId === categoryId,
    );

    if (hasChildren) {
      throw new Error(
        "Cannot delete category with children. Delete or reassign children first.",
      );
    }
  }

  /**
   * Helper: Check if targetId is a descendant of ancestorId
   */
  private isDescendantOf(
    targetId: string,
    ancestorId: string,
    allCategories: CategoryEntity[],
  ): boolean {
    const categoryMap = new Map(
      allCategories.map((cat) => [cat.categoryId, cat]),
    );

    let current = categoryMap.get(targetId);
    const visited = new Set<string>();

    while (current && current.parentId) {
      if (visited.has(current.categoryId)) {
        // Prevent infinite loop in case of corrupted data
        this.logger.error(`Circular reference detected in database for category ${current.categoryId}`);
        break;
      }
      visited.add(current.categoryId);

      if (current.parentId === ancestorId) {
        return true;
      }

      current = categoryMap.get(current.parentId);
    }

    return false;
  }

  async validateNoProductsInCategory(categoryId: string): Promise<void> {
  }
}
