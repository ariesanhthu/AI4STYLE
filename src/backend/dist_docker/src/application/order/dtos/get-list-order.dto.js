"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListOfOrdersQuerySchema = void 0;
const zod_1 = __importDefault(require("zod"));
const enums_1 = require("../../../core/order/enums");
const dtos_1 = require("../../../shared/dtos");
exports.getListOfOrdersQuerySchema = dtos_1.paginationCursorQuerySchema.extend({
    customerId: zod_1.default.string().optional(),
    status: zod_1.default.enum(enums_1.EOrderStatus).optional(),
    startDate: zod_1.default.string().optional(),
    endDate: zod_1.default.string().optional(),
    search: zod_1.default.string().optional(),
});
//# sourceMappingURL=get-list-order.dto.js.map