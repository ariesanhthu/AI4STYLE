import { Strategy } from 'passport-jwt';
import { JwtPayload } from '@/shared/interfaces';
import { type IUserRepository } from '@/core/user/interfaces';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    validate(payload: JwtPayload): Promise<{
        id: string;
        roleId: string;
        role: {
            id: string;
            name: string;
            description: string | null;
            type: import("../../../shared/enums").EUserType;
            permissions: import("../../../shared/enums").EPermission[];
            createdAt: Date;
            updatedAt: Date;
        } | undefined;
        name: string;
        email: string;
        phone: string;
        avatar: string;
        gender: import("../../../core/user/enums").EGender;
        birthdate: Date;
        address: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
