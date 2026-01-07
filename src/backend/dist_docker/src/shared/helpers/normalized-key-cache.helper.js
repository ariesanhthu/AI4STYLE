"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizedKeyCacheHelper = void 0;
const normalizeKey = (key) => key.trim().toLowerCase();
class NormalizedKeyCacheHelper {
    static otpKey(email) {
        return `otp-${normalizeKey(email)}`;
    }
    static otpTypeKey(otpCode) {
        return `otp-type-${normalizeKey(otpCode)}`;
    }
    static authOperationKey(email) {
        return `auth-operation-${normalizeKey(email)}`;
    }
    static refreshTokenKey(userId) {
        return `refresh-token-${normalizeKey(userId)}`;
    }
}
exports.NormalizedKeyCacheHelper = NormalizedKeyCacheHelper;
//# sourceMappingURL=normalized-key-cache.helper.js.map