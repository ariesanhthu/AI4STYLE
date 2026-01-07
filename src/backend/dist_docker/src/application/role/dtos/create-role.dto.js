"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoleSchema = void 0;
const enums_1 = require("../../../shared/enums");
const zod_1 = __importDefault(require("zod"));
exports.createRoleSchema = zod_1.default.object({
    name: zod_1.default
        .string({ error: 'Name must be a string' })
        .min(1, 'Name cannot be empty')
        .max(50, 'Name must be less than 50 characters')
        .trim(),
    description: zod_1.default
        .string({
        error: 'Description must be a string',
    })
        .max(255, 'Description must be less than 255 characters')
        .trim()
        .default('')
        .optional(),
    permissions: zod_1.default.array(zod_1.default.enum(enums_1.EPermission, { error: 'Invalid permission' }), {
        error: 'Permissions must be an array',
    }),
});
//# sourceMappingURL=create-role.dto.js.map