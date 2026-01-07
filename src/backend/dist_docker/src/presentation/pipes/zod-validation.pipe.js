"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = __importDefault(require("zod"));
class ZodValidationPipe {
    schema;
    constructor(schema) {
        this.schema = schema;
    }
    transform(value, metadata) {
        const parsedValue = this.schema.safeParse(value);
        if (!parsedValue.success) {
            const pretty = zod_1.default.prettifyError(parsedValue.error);
            throw new common_1.BadRequestException({
                name: 'Validation failed',
                message: pretty,
            });
        }
        return parsedValue.data;
    }
}
exports.ZodValidationPipe = ZodValidationPipe;
//# sourceMappingURL=zod-validation.pipe.js.map