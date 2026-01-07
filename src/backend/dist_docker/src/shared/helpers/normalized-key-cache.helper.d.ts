export declare class NormalizedKeyCacheHelper {
    static otpKey(email: string): string;
    static otpTypeKey(otpCode: string): string;
    static authOperationKey(email: string): string;
    static refreshTokenKey(userId: string): string;
}
