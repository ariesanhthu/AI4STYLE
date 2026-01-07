"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductOptionEntity = void 0;
class ProductOptionEntity {
    optionId;
    productId;
    name;
    slug;
    color;
    colorFamily;
    images;
    price;
    newPrice;
    outOfStock;
    isShow;
    search;
    createdAt;
    updatedAt;
    variants;
    constructor(optionId, productId, name, slug, color, colorFamily, images, price, newPrice, outOfStock, isShow, search, createdAt, updatedAt, variants) {
        this.optionId = optionId;
        this.productId = productId;
        this.name = name;
        this.slug = slug;
        this.color = color;
        this.colorFamily = colorFamily;
        this.images = images;
        this.price = price;
        this.newPrice = newPrice;
        this.outOfStock = outOfStock;
        this.isShow = isShow;
        this.search = search;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.variants = variants;
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
    getThumbnail() {
        return this.images && this.images.length > 0 ? this.images[0] : null;
    }
    toJSON() {
        return {
            optionId: this.optionId,
            productId: this.productId,
            name: this.name,
            slug: this.slug,
            color: this.color,
            colorFamily: this.colorFamily,
            thumbnail: this.getThumbnail(),
            images: this.images,
            price: this.price,
            newPrice: this.newPrice === this.price ? null : this.newPrice,
            outOfStock: this.outOfStock,
            isShow: this.isShow,
            search: this.search,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            hasDiscount: this.hasDiscount(),
            discountPercentage: this.getDiscountPercentage(),
            variants: this.variants?.map((variant) => variant.toJSON()),
        };
    }
}
exports.ProductOptionEntity = ProductOptionEntity;
//# sourceMappingURL=product-option.entity.js.map