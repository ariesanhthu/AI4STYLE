import { RoleService } from '@/application/role/services/role.service';
import { type CreateRoleDto, type GetListRoleDto, type UpdateRoleDto } from '@/application/role/dtos';
import { EPermission } from '@/shared/enums';
export declare class RoleAdminController {
    private readonly roleService;
    constructor(roleService: RoleService);
    getListRoles(query: GetListRoleDto): Promise<{
        items: {
            id: string;
            name: string;
            description: string | null;
            type: import("@/shared/enums").EUserType;
            permissions: EPermission[];
            createdAt: Date;
            updatedAt: Date;
        }[];
        nextCursor: string | null;
    }>;
    getRoleById(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        type: import("@/shared/enums").EUserType;
        permissions: EPermission[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    createRole(body: CreateRoleDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        type: import("@/shared/enums").EUserType;
        permissions: EPermission[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateRole(id: string, body: UpdateRoleDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        type: import("@/shared/enums").EUserType;
        permissions: EPermission[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteRole(id: string): Promise<{
        success: boolean;
    }>;
    getListPermissions(): Promise<{
        permissions: EPermission[];
    }>;
}
