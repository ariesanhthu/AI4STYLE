"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListRoleSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const enums_1 = require("../../../shared/enums");
const dtos_1 = require("../../../shared/dtos");
exports.getListRoleSchema = dtos_1.paginationCursorQuerySchema.extend({
    type: zod_1.default.enum(enums_1.EUserType, { error: 'Invalid type' }).optional(),
    search: zod_1.default.string().optional(),
});
//# sourceMappingURL=get-list-role.dto.js.map