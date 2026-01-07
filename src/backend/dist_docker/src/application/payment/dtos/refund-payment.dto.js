"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundPaymentStatusSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.refundPaymentStatusSchema = zod_1.default.object({
    amount: zod_1.default.number().min(0, 'Refund amount must be non-negative'),
    requestBy: zod_1.default.string().min(1, 'RequestBy is required'),
});
//# sourceMappingURL=refund-payment.dto.js.map