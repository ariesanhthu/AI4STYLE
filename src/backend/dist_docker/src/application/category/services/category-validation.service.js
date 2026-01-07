"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValidationService = void 0;
const enums_1 = require("../../../shared/enums");
const exceptions_1 = require("../../../core/category/exceptions");
class CategoryValidationService {
    categoryRepository;
    logger;
    constructor(categoryRepository, logger) {
        this.categoryRepository = categoryRepository;
        this.logger = logger;
        this.logger.setContext(CategoryValidationService.name);
    }
    async validateCategoryExists(id) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new exceptions_1.CategoryNotFoundException(id);
        }
        return category;
    }
    async validateUnique(slug, name, excludedId) {
        if (!slug && !name) {
            return;
        }
        const isUnique = await this.categoryRepository.checkUnique({ slug, name, excludedId });
        if (!isUnique) {
            if (slug)
                throw new exceptions_1.CategorySlugAlreadyExistsException(slug);
            if (name)
                throw new exceptions_1.CategoryNameAlreadyExistsException(name);
        }
    }
    async validateParentExists(parentId) {
        if (!parentId) {
            return null;
        }
        const parent = await this.categoryRepository.findById(parentId);
        if (!parent) {
            throw new exceptions_1.CategoryNotFoundException(parentId);
        }
        return parent;
    }
    async validateNoCircularReference(categoryId, newParentId) {
        if (!newParentId) {
            return;
        }
        if (categoryId === newParentId) {
            throw new exceptions_1.CategoryCircularReferenceException(categoryId, newParentId);
        }
        const allCategories = await this.categoryRepository.findAll({
            limit: 1000,
            cursor: null,
            sortOrder: enums_1.ESortOrder.ASC,
        });
        const isDescendant = this.isDescendantOf(newParentId, categoryId, allCategories);
        if (isDescendant) {
            throw new exceptions_1.CategoryCircularReferenceException(categoryId, newParentId);
        }
    }
    async validateNoChildren(categoryId) {
        const allCategories = await this.categoryRepository.findAll({
            limit: 1000,
            cursor: null,
            sortOrder: enums_1.ESortOrder.ASC,
        });
        const hasChildren = allCategories.some((cat) => cat.parentId === categoryId);
        if (hasChildren) {
            throw new exceptions_1.CategoryHasChildrenException(categoryId);
        }
    }
    isDescendantOf(targetId, ancestorId, allCategories) {
        const categoryMap = new Map(allCategories.map((cat) => [cat.categoryId, cat]));
        let current = categoryMap.get(targetId);
        const visited = new Set();
        while (current && current.parentId) {
            if (visited.has(current.categoryId)) {
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
    async validateNoProductsInCategory(categoryId) { }
}
exports.CategoryValidationService = CategoryValidationService;
//# sourceMappingURL=category-validation.service.js.map