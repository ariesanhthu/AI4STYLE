"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentMethodResponseSchema = void 0;
const enums_1 = require("../../../core/payment-method/enums");
const zod_1 = __importDefault(require("zod"));
exports.paymentMethodResponseSchema = zod_1.default.object({
    paymentMethodId: zod_1.default.string(),
    displayName: zod_1.default.string(),
    type: zod_1.default.enum(enums_1.EPaymentMethod),
    icon: zod_1.default.string().nullable(),
    description: zod_1.default.string().nullable(),
    createdAt: zod_1.default.string(),
    updatedAt: zod_1.default.string(),
});
//# sourceMappingURL=payment-method-response.dto.js.map