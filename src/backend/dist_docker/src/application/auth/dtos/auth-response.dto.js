"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenResponseSchema = exports.otpResponseSchema = exports.booleanResponseSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.booleanResponseSchema = zod_1.default.boolean();
exports.otpResponseSchema = zod_1.default.object({
    otp: zod_1.default.string().optional(),
    success: zod_1.default.boolean().optional(),
});
exports.tokenResponseSchema = zod_1.default.object({
    accessToken: zod_1.default.string(),
    refreshToken: zod_1.default.string(),
});
//# sourceMappingURL=auth-response.dto.js.map