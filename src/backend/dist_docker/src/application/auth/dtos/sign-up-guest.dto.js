"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpGuestSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signUpGuestSchema = zod_1.default.object({
    email: zod_1.default.email('Invalid email address'),
    password: zod_1.default.string().min(8, 'Password must be at least 8 characters long'),
    name: zod_1.default.string().min(1, 'Name is required'),
});
//# sourceMappingURL=sign-up-guest.dto.js.map