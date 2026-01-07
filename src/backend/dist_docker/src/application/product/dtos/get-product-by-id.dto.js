"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductByIdQuerySchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.getProductByIdQuerySchema = zod_1.default.object({
    includeOptions: zod_1.default.coerce.boolean().optional(),
    includeVariants: zod_1.default.coerce.boolean().optional(),
});
//# sourceMappingURL=get-product-by-id.dto.js.map