import { RoleEntity } from '@/core/role/entities';
import { EGender } from '../enums';
export declare class UserEntity {
    readonly id: string;
    readonly email: string;
    phone: string;
    hashedPassword: string;
    name: string;
    avatar: string;
    gender: EGender;
    birthdate: Date;
    address: string;
    search: string;
    updatedAt: Date;
    readonly createdAt: Date;
    readonly roleId: string;
    readonly role?: RoleEntity | undefined;
    constructor(id: string, email: string, phone: string, hashedPassword: string, name: string, avatar: string, gender: EGender, birthdate: Date, address: string, search: string, updatedAt: Date, createdAt: Date, roleId: string, role?: RoleEntity | undefined);
    toJSON(): {
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
        gender: EGender;
        birthdate: Date;
        address: string;
        createdAt: Date;
        updatedAt: Date;
    };
}
