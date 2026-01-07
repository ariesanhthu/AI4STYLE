"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.updateCategorySchema = zod_1.default.object({
    name: zod_1.default
        .string({ error: 'Name must be a string' })
        .min(1, 'Name cannot be empty')
        .max(100, 'Name must be less than 100 characters')
        .trim()
        .optional(),
    slug: zod_1.default
        .string({ error: 'Slug must be a string' })
        .min(1, 'Slug cannot be empty')
        .max(100, 'Slug must be less than 100 characters')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly (lowercase letters, numbers, hyphens)')
        .trim()
        .optional(),
    description: zod_1.default
        .string({ error: 'Description must be a string' })
        .max(500, 'Description must be less than 500 characters')
        .trim()
        .optional()
        .nullable(),
    icon: zod_1.default
        .string({ error: 'Icon must be a string' })
        .max(100, 'Icon must be less than 100 characters')
        .trim()
        .optional()
        .nullable(),
    parentId: zod_1.default
        .string({ error: 'Parent ID must be a string' })
        .nullable()
        .optional(),
});
//# sourceMappingURL=update-category.dto.js.map