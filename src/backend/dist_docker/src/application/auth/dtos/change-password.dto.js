"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.changePasswordSchema = zod_1.default.object({
    email: zod_1.default.email('Invalid email address'),
    oldPassword: zod_1.default.string().min(8, 'Password must be at least 8 characters long'),
    newPassword: zod_1.default.string().min(8, 'Password must be at least 8 characters long'),
});
//# sourceMappingURL=change-password.dto.js.map