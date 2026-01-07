"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderSchema = exports.createOrderDetailSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createOrderDetailSchema = zod_1.default.object({
    variantId: zod_1.default.string({ error: 'Variant ID must be a string' }),
    quantity: zod_1.default
        .number({ error: 'Quantity must be a number' })
        .int('Quantity must be an integer')
        .min(1, 'Quantity must be at least 1'),
});
exports.createOrderSchema = zod_1.default.object({
    recipientName: zod_1.default
        .string({ error: 'Recipient name must be a string' })
        .min(1, 'Recipient name cannot be empty')
        .max(255, 'Recipient name must be less than 255 characters')
        .trim(),
    phoneNumber: zod_1.default
        .string({ error: 'Phone number must be a string' })
        .regex(/^[0-9]{10,15}$/, 'Phone number must be 10-15 digits')
        .trim(),
    shippingAddress: zod_1.default
        .string({ error: 'Shipping address must be a string' })
        .min(1, 'Shipping address cannot be empty')
        .max(500, 'Shipping address must be less than 500 characters')
        .trim(),
    email: zod_1.default
        .string()
        .max(255, 'Email must be less than 255 characters')
        .trim()
        .nullable()
        .optional(),
    orderDetails: zod_1.default
        .array(exports.createOrderDetailSchema)
        .min(1, 'Order must have at least one item'),
});
//# sourceMappingURL=create-order.dto.js.map