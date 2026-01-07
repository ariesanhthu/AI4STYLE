import { AuthService } from '@/application/auth/services/auth.service';
import { BaseAuthController } from './base-auth.controller';
import { type SignUpGuestDto } from '@/application/auth/dtos';
export declare class AuthClientController extends BaseAuthController {
    protected readonly authService: AuthService;
    constructor(authService: AuthService);
    signUp(body: SignUpGuestDto): Promise<{
        success: boolean;
    }>;
}
