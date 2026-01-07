"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.uploadImageSchema = zod_1.default.object({
    title: zod_1.default
        .string({ error: 'Title must be a string' })
        .min(1, 'Title cannot be empty')
        .max(255, 'Title must be less than 255 characters')
        .trim(),
    file: zod_1.default.any().refine((file) => file !== undefined && file !== null, {
        message: 'File is required',
    }),
});
//# sourceMappingURL=upload-image.dto.js.map