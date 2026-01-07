import { EPermission, EUserType } from '@/shared/enums';
export declare class RoleEntity {
    readonly id: string;
    name: string;
    description: string | null;
    readonly type: EUserType;
    permissions: EPermission[];
    search: string;
    readonly createdAt: Date;
    updatedAt: Date;
    constructor(id: string, name: string, description: string | null, type: EUserType, permissions: EPermission[], search: string, createdAt: Date, updatedAt: Date);
    toJSON(): {
        id: string;
        name: string;
        description: string | null;
        type: EUserType;
        permissions: EPermission[];
        createdAt: Date;
        updatedAt: Date;
    };
}
