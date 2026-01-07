import { JwtService } from '@nestjs/jwt';
import { ITokenService } from '@/shared/interfaces';
export declare class NestTokenService implements ITokenService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    sign(payload: object, options?: object): string;
    verify<T extends object = any>(token: string, options?: object): T;
}
