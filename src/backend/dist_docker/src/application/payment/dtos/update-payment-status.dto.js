"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentStatusSchema = void 0;
const enums_1 = require("../../../core/payment/enums");
const zod_1 = __importDefault(require("zod"));
exports.updatePaymentStatusSchema = zod_1.default.object({
    status: zod_1.default.enum(enums_1.EPaymentStatus, {
        error: 'Payment status must be a valid status',
    }),
});
//# sourceMappingURL=update-payment-status.dto.js.map