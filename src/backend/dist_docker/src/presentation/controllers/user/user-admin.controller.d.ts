import { UserService } from '@/application/user/services/user.service';
import { type GetListUserDto, type UpdateUserDto } from '@/application/user/dtos';
import { BaseUserController } from './base-user.controller';
import { EPermission } from '@/shared/enums';
import { type UserInterface } from '@/shared/interfaces';
export declare class UserAdminController extends BaseUserController {
    protected readonly userService: UserService;
    constructor(userService: UserService);
    getList(query: GetListUserDto): Promise<{
        items: {
            id: string;
            roleId: string;
            role: {
                id: string;
                name: string;
                description: string | null;
                type: import("@/shared/enums").EUserType;
                permissions: EPermission[];
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
    getProfile(user: UserInterface): Promise<{
        id: string;
        roleId: string;
        role: {
            id: string;
            name: string;
            description: string | null;
            type: import("@/shared/enums").EUserType;
            permissions: EPermission[];
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
    getById(id: string): Promise<{
        id: string;
        roleId: string;
        role: {
            id: string;
            name: string;
            description: string | null;
            type: import("@/shared/enums").EUserType;
            permissions: EPermission[];
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
    updateById(id: string, body: UpdateUserDto): Promise<import("../../../core/user/entities").UserEntity | null>;
}
