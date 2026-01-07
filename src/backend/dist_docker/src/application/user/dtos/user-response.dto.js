"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResponseSchema = void 0;
const enums_1 = require("../../../core/user/enums");
const enums_2 = require("../../../shared/enums");
const zod_1 = __importDefault(require("zod"));
exports.userResponseSchema = zod_1.default.object({
    id: zod_1.default.string(),
    roleId: zod_1.default.string(),
    role: zod_1.default
        .object({
        id: zod_1.default.string(),
        name: zod_1.default.string(),
        description: zod_1.default.string().nullable(),
        type: zod_1.default.enum(enums_2.EUserType),
        permissions: zod_1.default.array(zod_1.default.enum(enums_2.EPermission)),
        createdAt: zod_1.default.string(),
        updatedAt: zod_1.default.string(),
    }),
    name: zod_1.default.string(),
    email: zod_1.default.string(),
    phone: zod_1.default.string(),
    gender: zod_1.default.enum(enums_1.EGender),
    avatar: zod_1.default.string(),
    birthdate: zod_1.default.string(),
    address: zod_1.default.string(),
    createdAt: zod_1.default.string(),
    updatedAt: zod_1.default.string(),
});
//# sourceMappingURL=user-response.dto.js.map