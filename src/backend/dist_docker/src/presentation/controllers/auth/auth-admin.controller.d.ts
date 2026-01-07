import { BaseAuthController } from './base-auth.controller';
import { AuthService } from '@/application/auth/services';
import { type SignUpStaffDto } from '@/application/auth/dtos';
export declare class AuthAdminController extends BaseAuthController {
    protected readonly authService: AuthService;
    constructor(authService: AuthService);
    signUp(body: SignUpStaffDto): Promise<{
        success: boolean;
    }>;
}
