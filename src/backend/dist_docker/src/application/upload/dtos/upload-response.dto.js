"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageArrayResponseSchema = exports.imageResponseSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.imageResponseSchema = zod_1.default.object({
    id: zod_1.default.string(),
    title: zod_1.default.string(),
    url: zod_1.default.string(),
    format: zod_1.default.string(),
    size: zod_1.default.number(),
    createdAt: zod_1.default.string(),
    updatedAt: zod_1.default.string(),
});
exports.imageArrayResponseSchema = zod_1.default.array(exports.imageResponseSchema);
//# sourceMappingURL=upload-response.dto.js.map