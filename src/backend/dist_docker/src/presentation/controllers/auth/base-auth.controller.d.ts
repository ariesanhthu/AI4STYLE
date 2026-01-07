import { AuthService } from '@/application/auth/services/auth.service';
import { type ChangePasswordDto, type ForgetPasswordDto, type OtpRequestDto, type SignInDto, type VerifyOtpDto } from '@/application/auth/dtos';
import type { UserInterface } from '@/shared/interfaces';
export declare abstract class BaseAuthController {
    protected readonly authService: AuthService;
    constructor(authService: AuthService);
    signIn(body: SignInDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    signOut(user: UserInterface): Promise<{
        success: boolean;
    }> | undefined;
    changePassword(body: ChangePasswordDto, user: UserInterface): Promise<{
        success: boolean;
    }>;
    forgetPassword(body: ForgetPasswordDto): Promise<{
        success: boolean;
    }>;
    refreshToken(refreshToken?: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    requestOtp(body: OtpRequestDto): Promise<{
        otp: string;
        success?: undefined;
    } | {
        success: boolean;
        otp?: undefined;
    }>;
    verifyOtp(body: VerifyOtpDto): Promise<{
        success: boolean;
    }>;
}
