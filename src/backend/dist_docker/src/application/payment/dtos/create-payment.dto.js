"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentResponseSchema = exports.createPaymentSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createPaymentSchema = zod_1.default.object({
    orderId: zod_1.default.string({ error: 'Order ID must be a string' }),
    paymentMethodId: zod_1.default.string({ error: 'Payment method ID must be a string' }),
});
exports.createPaymentResponseSchema = zod_1.default.object({
    payUrl: zod_1.default.string().nullable(),
});
//# sourceMappingURL=create-payment.dto.js.map