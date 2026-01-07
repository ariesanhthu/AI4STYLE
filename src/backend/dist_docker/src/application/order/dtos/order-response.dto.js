"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderResponseDetailDtoSchema = exports.orderResponseSchema = void 0;
const dtos_1 = require("../../product/dtos");
const enums_1 = require("../../../core/order/enums");
const zod_1 = __importDefault(require("zod"));
const orderDetailResponseSchema = zod_1.default.object({
    orderDetailId: zod_1.default.string(),
    orderId: zod_1.default.string(),
    variantId: zod_1.default.string(),
    quantity: zod_1.default.number(),
    pricePerUnit: zod_1.default.number(),
    createdAt: zod_1.default.string(),
    updatedAt: zod_1.default.string(),
});
exports.orderResponseSchema = zod_1.default.object({
    orderId: zod_1.default.string(),
    userId: zod_1.default.string(),
    orderCode: zod_1.default.string(),
    totalPrice: zod_1.default.number(),
    status: zod_1.default.enum(enums_1.EOrderStatus),
    recipientName: zod_1.default.string(),
    phoneNumber: zod_1.default.string(),
    shippingAddress: zod_1.default.string(),
    email: zod_1.default.string().nullable(),
    createdAt: zod_1.default.string(),
    updatedAt: zod_1.default.string(),
    orderDetails: zod_1.default.array(orderDetailResponseSchema).optional(),
});
exports.orderResponseDetailDtoSchema = exports.orderResponseSchema
    .omit({
    orderDetails: true,
})
    .extend({
    orderDetails: zod_1.default.array(orderDetailResponseSchema.extend({
        variant: dtos_1.variantSchema.pick({
            sku: true,
            size: true
        }).extend({
            name: zod_1.default.string(),
            color: zod_1.default.string(),
            thumbnail: zod_1.default.string(),
            optionId: zod_1.default.string(),
            slug: zod_1.default.string(),
        }),
    })),
});
//# sourceMappingURL=order-response.dto.js.map