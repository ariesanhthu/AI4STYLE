import { ChangePasswordDto, ForgetPasswordDto, OtpRequestDto, SignInDto, SignUpGuestDto, SignUpStaffDto, VerifyOtpDto } from '../dtos';
import { type IUserRepository } from '@/core/user/interfaces';
import { type IRoleRepository } from '@/core/role/interfaces';
import { ICacheService, ILoggerService, ITokenService } from '@/shared/interfaces';
export declare class AuthService {
    private readonly userRepository;
    private readonly roleRepository;
    private readonly tokenService;
    private readonly cacheService;
    private readonly logger;
    constructor(userRepository: IUserRepository, roleRepository: IRoleRepository, tokenService: ITokenService, cacheService: ICacheService, logger: ILoggerService);
    generateOtp(body: OtpRequestDto): Promise<{
        otp: string;
        success?: undefined;
    } | {
        success: boolean;
        otp?: undefined;
    }>;
    signUpGuest(body: SignUpGuestDto): Promise<{
        success: boolean;
    }>;
    signUpStaff(body: SignUpStaffDto): Promise<{
        success: boolean;
    }>;
    signIn(body: SignInDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    signOut(userId: string): Promise<{
        success: boolean;
    }>;
    refreshToken(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    changePassword(body: ChangePasswordDto): Promise<{
        success: boolean;
    }>;
    forgetPassword(body: ForgetPasswordDto): Promise<{
        success: boolean;
    }>;
    verifyOtp(body: VerifyOtpDto): Promise<{
        success: boolean;
    }>;
}
