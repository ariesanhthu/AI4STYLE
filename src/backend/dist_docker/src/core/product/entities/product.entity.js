"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductEntity = void 0;
class ProductEntity {
    productId;
    categoryId;
    name;
    description;
    thumbnail;
    search;
    createdAt;
    updatedAt;
    options;
    constructor(productId, categoryId, name, description, thumbnail, search, createdAt, updatedAt, options) {
        this.productId = productId;
        this.categoryId = categoryId;
        this.name = name;
        this.description = description;
        this.thumbnail = thumbnail;
        this.search = search;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.options = options;
    }
    toJSON() {
        return {
            productId: this.productId,
            categoryId: this.categoryId,
            name: this.name,
            description: this.description,
            thumbnail: this.thumbnail,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            options: this.options?.map((option) => option.toJSON()),
        };
    }
}
exports.ProductEntity = ProductEntity;
//# sourceMappingURL=product.entity.js.map