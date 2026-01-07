"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiZodQuery = ApiZodQuery;
exports.ApiZodBody = ApiZodBody;
exports.ApiZodResponse = ApiZodResponse;
exports.ApiZodErrorResponse = ApiZodErrorResponse;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = __importDefault(require("zod"));
require("reflect-metadata");
const api_response_dto_1 = require("../../../../shared/dtos/api-response.dto");
function getSwaggerType(zodType) {
    const typeName = zodType.def.type;
    switch (typeName) {
        case 'string':
            return String;
        case 'number':
            return Number;
        case 'boolean':
            return Boolean;
        default:
            return String;
    }
}
function ApiZodQuery(schema) {
    const jsonSchema = zod_1.default.toJSONSchema(schema);
    const required = jsonSchema.required ? jsonSchema.required : [];
    const decorators = Object.entries(jsonSchema.properties).map(([key, value]) => {
        return (0, swagger_1.ApiQuery)({ name: key, required: required.includes(key), type: String, enum: value.enum });
    });
    return (0, common_1.applyDecorators)(...decorators);
}
function ApiZodBody(schema) {
    const jsonSchema = zod_1.default.toJSONSchema(schema);
    const decorators = [(0, swagger_1.ApiBody)({ schema: jsonSchema })];
    return (0, common_1.applyDecorators)(...decorators);
}
function ApiZodResponse(options) {
    const jsonSchema = zod_1.default.toJSONSchema(api_response_dto_1.successResponseSchema.extend({ data: options.schema }));
    return (0, swagger_1.ApiResponse)({
        status: options.status,
        description: options.description,
        schema: jsonSchema,
    });
}
function ApiZodErrorResponse(schema) {
    const jsonSchema = zod_1.default.toJSONSchema(schema);
    const decorators = [
        (0, swagger_1.ApiResponse)({
            status: '4XX',
            description: 'Error Response from client',
            schema: jsonSchema,
        }),
        (0, swagger_1.ApiResponse)({
            status: '5XX',
            description: 'Error Response from server',
            schema: jsonSchema,
        }),
    ];
    return (0, common_1.applyDecorators)(...decorators);
}
//# sourceMappingURL=zod-swagger.decorator.js.map