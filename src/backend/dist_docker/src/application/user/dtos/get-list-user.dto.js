"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListUserSchema = void 0;
const dtos_1 = require("../../../shared/dtos");
const enums_1 = require("../../../shared/enums");
const zod_1 = __importDefault(require("zod"));
exports.getListUserSchema = dtos_1.paginationCursorQuerySchema.extend({
    type: zod_1.default.enum(enums_1.EUserType).optional(),
    roleId: zod_1.default.string('roleId must be a string').optional(),
    search: zod_1.default.string('search must be a string').optional(),
});
//# sourceMappingURL=get-list-user.dto.js.map