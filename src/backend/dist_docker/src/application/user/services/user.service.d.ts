import { GetListUserDto, UpdateUserDto } from '../dtos';
import { type IUserRepository } from '@/core/user/interfaces';
import { ILoggerService } from '@/shared/interfaces';
import { EUserType } from '@/shared/enums';
export declare class UserService {
    private readonly userRepository;
    private readonly logger;
    constructor(userRepository: IUserRepository, logger: ILoggerService);
    getListOfUsers(query: GetListUserDto): Promise<{
        items: {
            id: string;
            roleId: string;
            role: {
                id: string;
                name: string;
                description: string | null;
                type: EUserType;
                permissions: import("@/shared/enums").EPermission[];
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
        }[];
        nextCursor: string | null;
    }>;
    getUserProfile(id: string): Promise<{
        id: string;
        roleId: string;
        role: {
            id: string;
            name: string;
            description: string | null;
            type: EUserType;
            permissions: import("@/shared/enums").EPermission[];
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
    updateProfile(userId: string, body: UpdateUserDto): Promise<import("../../../core/user/entities").UserEntity | null>;
    deleteUser(userId: string): Promise<{
        success: boolean;
    }>;
}
