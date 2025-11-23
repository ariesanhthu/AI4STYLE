const normalizeKey = (key: string) => key.trim().toLowerCase();

export class NormalizedKeyCacheHelper {
  static otpKey(email: string): string {
    return `otp-${normalizeKey(email)}`;
  }

  static otpTypeKey(otpCode: string): string {
    return `otp-type-${normalizeKey(otpCode)}`;
  }

  static authOperationKey(email: string): string {
    return `auth-operation-${normalizeKey(email)}`;
  }

  static refreshTokenKey(userId: string): string {
    return `refresh-token-${normalizeKey(userId)}`;
  }
}
