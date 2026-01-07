"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const update_user_profile_dto_1 = require("./update-user-profile.dto");
exports.updateUserSchema = update_user_profile_dto_1.updateUserProfileSchema.extend({
    roleId: zod_1.default.string().optional(),
});
//# sourceMappingURL=update-user.dto.js.map