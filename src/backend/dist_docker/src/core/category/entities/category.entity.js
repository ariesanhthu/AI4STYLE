"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryEntity = void 0;
class CategoryEntity {
    categoryId;
    parentId;
    name;
    slug;
    icon;
    description;
    search;
    createdAt;
    updatedAt;
    parent;
    constructor(categoryId, parentId, name, slug, icon, description, search, createdAt, updatedAt, parent) {
        this.categoryId = categoryId;
        this.parentId = parentId;
        this.name = name;
        this.slug = slug;
        this.icon = icon;
        this.description = description;
        this.search = search;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.parent = parent;
    }
    toJSON() {
        return {
            categoryId: this.categoryId,
            parentId: this.parentId,
            name: this.name,
            slug: this.slug,
            icon: this.icon,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            parent: this.parent ? this.parent.toJSON() : undefined,
        };
    }
}
exports.CategoryEntity = CategoryEntity;
//# sourceMappingURL=category.entity.js.map