"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductSchema = exports.optionSchema = exports.variantSchema = void 0;
const zod_1 = require("zod");
exports.variantSchema = zod_1.z.object({
    sku: zod_1.z.string().min(1, 'SKU is required').max(50),
    size: zod_1.z.string().min(1, 'Size is required').max(20),
    price: zod_1.z.number().int().min(0, 'Price must be non-negative'),
    newPrice: zod_1.z.number().int().min(0).optional().nullable(),
    stockQuantity: zod_1.z
        .number()
        .int()
        .min(0, 'Stock quantity must be non-negative')
        .default(0),
});
exports.optionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Option name is required').max(255),
    color: zod_1.z
        .string()
        .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, 'Invalid hex color format'),
    colorFamily: zod_1.z
        .string()
        .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, 'Invalid hex color format'),
    thumbnail: zod_1.z.string('Invalid thumbnail URL'),
    images: zod_1.z
        .array(zod_1.z.string('Invalid image URL'))
        .min(1, 'At least one image is required'),
    isShow: zod_1.z.boolean().default(true),
    variants: zod_1.z
        .array(exports.variantSchema)
        .min(1, 'At least one variant is required for each option'),
});
exports.createProductSchema = zod_1.z.object({
    categoryId: zod_1.z.string('Invalid category ID'),
    name: zod_1.z.string().min(1, 'Product name is required').max(255),
    description: zod_1.z.string().max(2000).optional(),
    options: zod_1.z
        .array(exports.optionSchema)
        .min(1, 'At least one option (color variant) is required'),
});
//# sourceMappingURL=create-product.dto.js.map