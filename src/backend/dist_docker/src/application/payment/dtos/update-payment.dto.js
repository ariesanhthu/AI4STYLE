"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.updatePaymentSchema = zod_1.default.object({
    paymentMethodId: zod_1.default.string('Payment method ID must be a string'),
});
//# sourceMappingURL=update-payment.dto.js.map