"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantEntity = void 0;
class ProductVariantEntity {
    variantId;
    optionId;
    sku;
    size;
    price;
    newPrice;
    stockQuantity;
    createdAt;
    updatedAt;
    constructor(variantId, optionId, sku, size, price, newPrice, stockQuantity, createdAt, updatedAt) {
        this.variantId = variantId;
        this.optionId = optionId;
        this.sku = sku;
        this.size = size;
        this.price = price;
        this.newPrice = newPrice;
        this.stockQuantity = stockQuantity;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    getDisplayPrice() {
        return this.newPrice;
    }
    hasDiscount() {
        return this.newPrice < this.price;
    }
    getDiscountPercentage() {
        if (!this.hasDiscount()) {
            return null;
        }
        return Math.round(((this.price - this.newPrice) / this.price) * 100);
    }
    isInStock() {
        return this.stockQuantity > 0;
    }
    isLowStock(threshold = 10) {
        return this.stockQuantity > 0 && this.stockQuantity < threshold;
    }
    toJSON() {
        return {
            variantId: this.variantId,
            optionId: this.optionId,
            sku: this.sku,
            size: this.size,
            price: this.price,
            newPrice: this.newPrice === this.price ? null : this.newPrice,
            stockQuantity: this.stockQuantity,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            hasDiscount: this.hasDiscount(),
            discountPercentage: this.getDiscountPercentage(),
            inStock: this.isInStock(),
            lowStock: this.isLowStock(),
        };
    }
}
exports.ProductVariantEntity = ProductVariantEntity;
//# sourceMappingURL=product-variant.entity.js.map