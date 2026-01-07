"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgetPasswordSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.forgetPasswordSchema = zod_1.default.object({
    email: zod_1.default.email('Invalid email address'),
    otp: zod_1.default.string().length(6, 'OTP must be 6 characters long'),
    newPassword: zod_1.default.string().min(8, 'Password must be at least 8 characters long'),
});
//# sourceMappingURL=forget-password.dto.js.map