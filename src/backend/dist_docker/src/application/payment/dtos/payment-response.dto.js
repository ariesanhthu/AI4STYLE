"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentResponseSchema = void 0;
const enums_1 = require("../../../core/payment-method/enums");
const enums_2 = require("../../../core/payment/enums");
const zod_1 = __importDefault(require("zod"));
const paymentTransactionResponseSchema = zod_1.default.object({
    transactionId: zod_1.default.string(),
    paymentId: zod_1.default.string(),
    requestBody: zod_1.default.string(),
    responseBody: zod_1.default.string(),
    type: zod_1.default.enum(enums_2.ETransactionType),
    createdAt: zod_1.default.string(),
    updatedAt: zod_1.default.string(),
});
exports.paymentResponseSchema = zod_1.default.object({
    paymentId: zod_1.default.string(),
    orderId: zod_1.default.string(),
    paymentMethodId: zod_1.default.string(),
    type: zod_1.default.enum(enums_1.EPaymentMethod),
    status: zod_1.default.enum(enums_2.EPaymentStatus),
    createdAt: zod_1.default.string(),
    updatedAt: zod_1.default.string(),
    transactions: zod_1.default
        .array(paymentTransactionResponseSchema)
        .optional()
        .nullable()
        .default(null),
});
//# sourceMappingURL=payment-response.dto.js.map