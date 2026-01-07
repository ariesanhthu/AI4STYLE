"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListProductClientSchema = exports.getListProductSchema = exports.EProductSortOption = void 0;
const zod_1 = __importDefault(require("zod"));
const dtos_1 = require("../../../shared/dtos");
var EProductSortOption;
(function (EProductSortOption) {
    EProductSortOption["PRICE"] = "price";
    EProductSortOption["TIME"] = "time";
})(EProductSortOption || (exports.EProductSortOption = EProductSortOption = {}));
exports.getListProductSchema = dtos_1.paginationCursorQuerySchema.extend({
    category_id: zod_1.default.string().optional(),
    is_show: zod_1.default.coerce.boolean().optional(),
    color_family: zod_1.default.string().optional(),
    min_price: zod_1.default.coerce.number().min(0).optional(),
    max_price: zod_1.default.coerce.number().min(0).optional(),
    search: zod_1.default.string().optional(),
});
exports.getListProductClientSchema = dtos_1.paginationCursorQuerySchema.extend({
    category_id: zod_1.default.string().optional(),
    color_family: zod_1.default.string().optional(),
    min_price: zod_1.default.coerce.number().min(0).optional(),
    max_price: zod_1.default.coerce.number().min(0).optional(),
    search: zod_1.default.string().optional(),
    sortOption: zod_1.default.enum(EProductSortOption).optional(),
});
//# sourceMappingURL=get-list-product.dto.js.map