"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaginationCursorResponseSchema = exports.paginationCursorResponseSchema = exports.paginationCursorQuerySchema = void 0;
const enums_1 = require("../enums");
const zod_1 = __importDefault(require("zod"));
exports.paginationCursorQuerySchema = zod_1.default.object({
    cursor: zod_1.default.string().nullable().default(null).optional(),
    limit: zod_1.default.coerce.number().default(10).optional(),
    sortOrder: zod_1.default.enum(enums_1.ESortOrder).default(enums_1.ESortOrder.DESC).optional(),
});
exports.paginationCursorResponseSchema = zod_1.default.object({
    items: zod_1.default.array(zod_1.default.any()),
    nextCursor: zod_1.default.string().nullable(),
});
const createPaginationCursorResponseSchema = (itemSchema) => zod_1.default.object({
    items: zod_1.default.array(itemSchema),
    nextCursor: zod_1.default.string().nullable(),
});
exports.createPaginationCursorResponseSchema = createPaginationCursorResponseSchema;
//# sourceMappingURL=pagination-cursor.dto.js.map