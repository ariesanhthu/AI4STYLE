"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponseSchema = exports.successResponseSchemaTemplate = exports.successResponseSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.successResponseSchema = zod_1.default.object({
    success: zod_1.default.boolean(),
    code: zod_1.default.number(),
    timestamp: zod_1.default.string(),
});
exports.successResponseSchemaTemplate = exports.successResponseSchema.extend({
    data: zod_1.default.any(),
});
exports.errorResponseSchema = zod_1.default.object({
    success: zod_1.default.boolean(),
    code: zod_1.default.number(),
    error: zod_1.default.any(),
    message: zod_1.default.string(),
    timestamp: zod_1.default.string(),
});
//# sourceMappingURL=api-response.dto.js.map