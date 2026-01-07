"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyProductVariantStockSchema = exports.updateProductStockPriceSchema = exports.updateVariantStockPriceSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.updateVariantStockPriceSchema = zod_1.default.object({
    variantId: zod_1.default.string('Invalid variant ID format'),
    price: zod_1.default
        .number()
        .int()
        .min(0, 'Price must be a non-negative integer')
        .optional(),
    newPrice: zod_1.default
        .number()
        .int()
        .min(0, 'New price must be a non-negative integer')
        .nullable()
        .optional(),
    stockQuantity: zod_1.default
        .number()
        .int()
        .min(0, 'Stock quantity must be a non-negative integer')
        .optional(),
});
exports.updateProductStockPriceSchema = zod_1.default.object({
    variants: zod_1.default
        .array(exports.updateVariantStockPriceSchema)
        .min(1, 'At least one variant must be provided'),
});
exports.modifyProductVariantStockSchema = zod_1.default.object({
    variants: zod_1.default
        .array(zod_1.default.object({
        variantId: zod_1.default.string('Invalid variant ID format'),
        stockChange: zod_1.default
            .number()
            .int()
            .refine((val) => val !== 0, {
            message: 'Quantity change must be a non-zero integer',
        }),
    }))
        .min(1, 'At least one variant must be provided'),
});
//# sourceMappingURL=update-product-stock-price.dto.js.map