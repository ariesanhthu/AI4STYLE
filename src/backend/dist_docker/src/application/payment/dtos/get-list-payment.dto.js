"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListOfPaymentsQuerySchema = void 0;
const zod_1 = __importDefault(require("zod"));
const enums_1 = require("../../../core/payment/enums");
const enums_2 = require("../../../core/payment-method/enums");
const dtos_1 = require("../../../shared/dtos");
exports.getListOfPaymentsQuerySchema = dtos_1.paginationCursorQuerySchema.extend({
    status: zod_1.default.enum(enums_1.EPaymentStatus).optional(),
    type: zod_1.default.enum(enums_2.EPaymentMethod).optional(),
    startDate: zod_1.default.string().optional(),
    endDate: zod_1.default.string().optional(),
});
//# sourceMappingURL=get-list-payment.dto.js.map