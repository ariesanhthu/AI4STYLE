"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkDeleteSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.bulkDeleteSchema = zod_1.default.object({
    ids: zod_1.default
        .array(zod_1.default.string('ID must be a string'), {
        error: 'ids must be an array of strings',
    })
        .min(1, 'At least one ID is required')
        .max(50, 'Maximum 50 items can be deleted at once'),
});
//# sourceMappingURL=bulk-delete.dto.js.map