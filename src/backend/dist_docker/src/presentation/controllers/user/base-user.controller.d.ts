import { UserService } from '@/application/user/services/user.service';
import { type UpdateUserProfileDto } from '@/application/user/dtos';
import type { UserInterface } from '@/shared/interfaces';
export declare abstract class BaseUserController {
    protected readonly userService: UserService;
    constructor(userService: UserService);
    getProfile(user: UserInterface): Promise<{
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
    updateProfile(user: UserInterface, updateData: UpdateUserProfileDto): Promise<import("../../../core/user/entities").UserEntity | null>;
}
