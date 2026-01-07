"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionResponseSchema = void 0;
const enums_1 = require("../../../shared/enums");
const zod_1 = require("zod");
exports.permissionResponseSchema = zod_1.z.object({
    permissions: zod_1.z.array(zod_1.z.enum(enums_1.EPermission))
});
//# sourceMappingURL=get-list-permission.dto.js.map