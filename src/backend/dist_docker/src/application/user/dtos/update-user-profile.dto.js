"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfileSchema = void 0;
const enums_1 = require("../../../core/user/enums");
const zod_1 = __importDefault(require("zod"));
exports.updateUserProfileSchema = zod_1.default.object({
    gender: zod_1.default.enum(enums_1.EGender).optional(),
    phone: zod_1.default
        .string('Phone must be a string')
        .optional(),
    name: zod_1.default.string('Name must be a string').min(2).max(100).optional(),
    avatar: zod_1.default.string('Avatar must be a string').optional(),
    birthdate: zod_1.default.iso.datetime('Birthdate must be a date').optional(),
    address: zod_1.default.string('Address must be a string').max(200).optional(),
});
//# sourceMappingURL=update-user-profile.dto.js.map