"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpStaffSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const sign_up_guest_dto_1 = require("./sign-up-guest.dto");
exports.signUpStaffSchema = sign_up_guest_dto_1.signUpGuestSchema.extend({
    role_id: zod_1.default.string('Role ID is required'),
});
//# sourceMappingURL=sign-up-staff.dto.js.map