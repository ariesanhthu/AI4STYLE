"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const crypto_1 = require("crypto");
const helpers_1 = require("../../../shared/helpers");
const entities_1 = require("../../../core/category/entities");
const enums_1 = require("../../../shared/enums");
const exceptions_1 = require("../../../core/category/exceptions");
class CategoryService {
    categoryRepository;
    validationService;
    logger;
    constructor(categoryRepository, validationService, logger) {
        this.categoryRepository = categoryRepository;
        this.validationService = validationService;
        this.logger = logger;
        this.logger.setContext(CategoryService.name);
    }
    async createCategory(dto) {
        try {
            if (dto.slug) {
                dto.slug = (0, helpers_1.buildSlug)(dto.slug);
            }
            await this.validationService.validateUnique(dto.slug, dto.name);
            if (dto.parentId) {
                await this.validationService.validateParentExists(dto.parentId);
            }
            const categoryEntity = new entities_1.CategoryEntity((0, crypto_1.randomUUID)(), dto.parentId ?? null, dto.name, dto.slug, dto.icon ?? null, dto.description ?? null, (0, helpers_1.buildSearchString)(dto.name, dto.description ?? ''), new Date(), new Date());
            const created = await this.categoryRepository.create(categoryEntity);
            this.logger.log(`Category created: ${created.categoryId}`);
            return created.toJSON();
        }
        catch (error) {
            this.logger.error(`Failed to create category: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getCategoryById(id) {
        try {
            const category = await this.categoryRepository.findById(id);
            if (!category) {
                throw new exceptions_1.CategoryNotFoundException(id);
            }
            return category.toJSON();
        }
        catch (error) {
            this.logger.error(`Failed to get category by id ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getCategoryBySlug(slug) {
        try {
            const category = await this.categoryRepository.findBySlug(slug);
            if (!category) {
                throw new exceptions_1.CategoryNotFoundException(slug);
            }
            return category.toJSON();
        }
        catch (error) {
            this.logger.error(`Failed to get category by slug ${slug}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getCategoryTree() {
        try {
            this.logger.log('Building category tree from all categories');
            const allCategories = await this.categoryRepository.findAll({
                limit: 1000,
                cursor: null,
                sortOrder: enums_1.ESortOrder.ASC,
            });
            return this.buildTree(allCategories);
        }
        catch (error) {
            this.logger.error(`Failed to build category tree: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getListCategory(query) {
        try {
            if (query.search) {
                query.search = (0, helpers_1.buildSearchString)(query.search);
            }
            if (!query.limit)
                query.limit = 10;
            if (!query.sortOrder)
                query.sortOrder = enums_1.ESortOrder.DESC;
            query.limit += 1;
            const categories = await this.categoryRepository.findAll(query);
            const nextCursor = categories.length === query.limit
                ? categories[categories.length - 1].categoryId
                : null;
            if (nextCursor) {
                categories.pop();
            }
            return {
                items: categories.map((category) => category.toJSON()),
                nextCursor,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get list category: ${error.message}`, error.stack);
            throw error;
        }
    }
    async updateCategory(id, dto) {
        try {
            const category = await this.validationService.validateCategoryExists(id);
            if (dto.slug) {
                dto.slug = (0, helpers_1.buildSlug)(dto.slug);
            }
            if ((dto.slug && dto.slug !== category.slug) ||
                (dto.name && dto.name !== category.name)) {
                const slug = dto?.slug !== category.slug ? dto.slug : undefined;
                const name = dto?.name !== category.name ? dto.name : undefined;
                await this.validationService.validateUnique(slug, name, id);
            }
            if (dto.parentId !== undefined && dto.parentId !== category.parentId) {
                await this.validationService.validateParentExists(dto.parentId);
                await this.validationService.validateNoCircularReference(id, dto.parentId);
            }
            if (dto.name)
                category.name = dto.name;
            if (dto.slug)
                category.slug = dto.slug;
            if (dto.parentId !== undefined)
                category.parentId = dto.parentId;
            if (dto.icon !== undefined)
                category.icon = dto.icon;
            if (dto.description !== undefined)
                category.description = dto.description;
            category.search = (0, helpers_1.buildSearchString)(category.name, category.description ?? '');
            category.updatedAt = new Date();
            const updated = await this.categoryRepository.update(category);
            if (!updated) {
                throw new exceptions_1.CategoryNotFoundException(id);
            }
            this.logger.log(`Category updated: ${id}`);
            return updated.toJSON();
        }
        catch (error) {
            this.logger.error(`Failed to update category with id ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async deleteCategory(id) {
        try {
            await this.validationService.validateCategoryExists(id);
            await this.validationService.validateNoChildren(id);
            await this.validationService.validateNoProductsInCategory(id);
            const deleted = await this.categoryRepository.delete(id);
            if (!deleted) {
                throw new exceptions_1.CategoryNotFoundException(id);
            }
            this.logger.log(`Category deleted: ${id}`);
            return { success: true, message: 'Category deleted successfully' };
        }
        catch (error) {
            this.logger.error(`Failed to delete category with id ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    buildTree(categories, targetId) {
        const categoryMap = new Map();
        const rootNodes = [];
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
        categories.forEach((cat) => {
            const node = categoryMap.get(cat.categoryId);
            if (cat.parentId === null) {
                rootNodes.push(node);
            }
            else {
                const parent = categoryMap.get(cat.parentId);
                if (parent) {
                    parent.childrens.push(node);
                }
                else {
                    this.logger.warn(`Category ${cat.categoryId} has invalid parent ${cat.parentId}`);
                    rootNodes.push(node);
                }
            }
        });
        return rootNodes;
    }
}
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map