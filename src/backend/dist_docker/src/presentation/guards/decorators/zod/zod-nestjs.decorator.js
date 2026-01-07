"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodBody = ZodBody;
exports.ZodQuery = ZodQuery;
exports.ZodParam = ZodParam;
const common_1 = require("@nestjs/common");
const pipes_1 = require("../../../pipes");
function ZodBody(schema, property) {
    if (property) {
        return (0, common_1.Body)(property, new pipes_1.ZodValidationPipe(schema));
    }
    return (0, common_1.Body)(new pipes_1.ZodValidationPipe(schema));
}
function ZodQuery(schema, property) {
    if (property) {
        return (0, common_1.Query)(property, new pipes_1.ZodValidationPipe(schema));
    }
    return (0, common_1.Query)(new pipes_1.ZodValidationPipe(schema));
}
function ZodParam(schema, property) {
    if (property) {
        return (0, common_1.Param)(property, new pipes_1.ZodValidationPipe(schema));
    }
    return (0, common_1.Param)(new pipes_1.ZodValidationPipe(schema));
}
//# sourceMappingURL=zod-nestjs.decorator.js.map