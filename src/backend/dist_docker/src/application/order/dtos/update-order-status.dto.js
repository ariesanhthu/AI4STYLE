"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusSchema = void 0;
const enums_1 = require("../../../core/order/enums");
const zod_1 = __importDefault(require("zod"));
exports.updateOrderStatusSchema = zod_1.default.object({
    status: zod_1.default.enum(enums_1.EOrderStatus, {
        error: 'Status must be a valid order status',
    }),
});
//# sourceMappingURL=update-order-status.dto.js.map