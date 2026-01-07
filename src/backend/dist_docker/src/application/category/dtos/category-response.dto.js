"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryTreeResponseSchema = exports.categoryTreeNodeSchema = exports.categoryResponseSchema = exports.baseCategoryResponseSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.baseCategoryResponseSchema = zod_1.default.object({
    categoryId: zod_1.default.string(),
    parentId: zod_1.default.string().nullable(),
    name: zod_1.default.string(),
    slug: zod_1.default.string(),
    icon: zod_1.default.string().nullable(),
    description: zod_1.default.string().nullable(),
    createdAt: zod_1.default.string(),
    updatedAt: zod_1.default.string(),
});
exports.categoryResponseSchema = exports.baseCategoryResponseSchema.extend({
    parent: exports.baseCategoryResponseSchema.optional(),
});
exports.categoryTreeNodeSchema = exports.baseCategoryResponseSchema.extend({
    childrens: zod_1.default.array(zod_1.default.any()),
});
exports.categoryTreeResponseSchema = zod_1.default.array(exports.categoryTreeNodeSchema);
//# sourceMappingURL=category-response.dto.js.map