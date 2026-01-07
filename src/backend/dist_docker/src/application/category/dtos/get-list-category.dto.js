"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListCategorySchema = void 0;
const dtos_1 = require("../../../shared/dtos");
const zod_1 = __importDefault(require("zod"));
exports.getListCategorySchema = dtos_1.paginationCursorQuerySchema.extend({
    search: zod_1.default.string().optional(),
});
//# sourceMappingURL=get-list-category.dto.js.map