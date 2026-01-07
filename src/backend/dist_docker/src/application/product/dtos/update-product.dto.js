"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = void 0;
const zod_1 = require("zod");
const create_product_dto_1 = require("./create-product.dto");
const updateOptionSchema = zod_1.z.object({
    optionId: zod_1.z.string('Invalid option ID'),
    name: zod_1.z.string().min(1).max(255).optional(),
    color: zod_1.z
        .string()
        .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, 'Invalid hex color format')
        .optional(),
    colorFamily: zod_1.z
        .string()
        .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, 'Invalid hex color format')
        .optional(),
    thumbnail: zod_1.z.string().url('Invalid thumbnail URL').optional(),
    images: zod_1.z.array(zod_1.z.string('Invalid image URL')).optional(),
    isShow: zod_1.z.boolean().optional(),
});
exports.updateProductSchema = zod_1.z.object({
    categoryId: zod_1.z.string('Invalid category ID').optional(),
    name: zod_1.z.string().min(1).max(255).optional(),
    description: zod_1.z.string().max(2000).optional(),
    options: zod_1.z.array(updateOptionSchema).optional(),
    newOptions: zod_1.z.array(create_product_dto_1.optionSchema).optional(),
    deleteOptionIds: zod_1.z.array(zod_1.z.string()).optional(),
});
//# sourceMappingURL=update-product.dto.js.map