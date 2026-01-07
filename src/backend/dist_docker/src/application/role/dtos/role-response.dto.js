"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleResponse = void 0;
const enums_1 = require("../../../shared/enums");
const zod_1 = __importDefault(require("zod"));
exports.roleResponse = zod_1.default.object({
    id: zod_1.default.string(),
    name: zod_1.default.string(),
    description: zod_1.default.string().nullable(),
    type: zod_1.default.enum(enums_1.EUserType),
    permissions: zod_1.default.array(zod_1.default.enum(enums_1.EPermission)),
    createdAt: zod_1.default.string(),
    updatedAt: zod_1.default.string(),
});
//# sourceMappingURL=role-response.dto.js.map