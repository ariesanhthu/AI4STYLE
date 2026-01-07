"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productResponseSchema = exports.productOptionResponseSchema = exports.productVariantResponseSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.productVariantResponseSchema = zod_1.default.object({
    variantId: zod_1.default.string(),
    optionId: zod_1.default.string(),
    sku: zod_1.default.string(),
    size: zod_1.default.string(),
    price: zod_1.default.number(),
    newPrice: zod_1.default.number().nullable(),
    stockQuantity: zod_1.default.number(),
    createdAt: zod_1.default.string(),
    updatedAt: zod_1.default.string(),
    hasDiscount: zod_1.default.boolean(),
    discountPercentage: zod_1.default.number().nullable(),
    inStock: zod_1.default.boolean(),
    lowStock: zod_1.default.boolean(),
});
exports.productOptionResponseSchema = zod_1.default.object({
    optionId: zod_1.default.string(),
    productId: zod_1.default.string(),
    name: zod_1.default.string(),
    slug: zod_1.default.string(),
    color: zod_1.default.string(),
    colorFamily: zod_1.default.string(),
    thumbnail: zod_1.default.string().nullable(),
    images: zod_1.default.array(zod_1.default.string()),
    price: zod_1.default.number(),
    newPrice: zod_1.default.number().nullable(),
    outOfStock: zod_1.default.boolean(),
    isShow: zod_1.default.boolean(),
    createdAt: zod_1.default.string(),
    updatedAt: zod_1.default.string(),
    hasDiscount: zod_1.default.boolean(),
    discountPercentage: zod_1.default.number().nullable(),
    variants: zod_1.default.array(exports.productVariantResponseSchema).optional(),
    relatedOptions: zod_1.default.array(zod_1.default.object({
        optionId: zod_1.default.string(),
        slug: zod_1.default.string(),
        thumbnail: zod_1.default.string()
    })).optional(),
});
exports.productResponseSchema = zod_1.default.object({
    productId: zod_1.default.string(),
    categoryId: zod_1.default.string(),
    name: zod_1.default.string(),
    description: zod_1.default.string().nullable(),
    thumbnail: zod_1.default.string().nullable(),
    createdAt: zod_1.default.string(),
    updatedAt: zod_1.default.string(),
    options: zod_1.default.array(exports.productOptionResponseSchema).optional(),
});
//# sourceMappingURL=product-response.dto.js.map