"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testQueryDto = exports.testParamsDto = exports.testBodyDto = void 0;
const zod_1 = __importDefault(require("zod"));
exports.testBodyDto = zod_1.default.object({
    message: zod_1.default.string().min(1).max(255),
});
exports.testParamsDto = zod_1.default.uuid();
exports.testQueryDto = zod_1.default.object({
    verbose: zod_1.default.coerce.boolean().optional(),
});
//# sourceMappingURL=test.dto.js.map