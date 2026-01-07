import { CreateRoleDto, GetListRoleDto, UpdateRoleDto } from '../dtos';
import { EPermission, EUserType } from '@/shared/enums';
import { type IRoleRepository } from '@/core/role/interfaces';
import { ILoggerService } from '@/shared/interfaces';
export declare class RoleService {
    private readonly roleRepository;
    private readonly logger;
    constructor(roleRepository: IRoleRepository, logger: ILoggerService);
    createRole(newRole: CreateRoleDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        type: EUserType;
        permissions: EPermission[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    getRoleById(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        type: EUserType;
        permissions: EPermission[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    getRoleByName(name: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        type: EUserType;
        permissions: EPermission[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    getListRoles(query: GetListRoleDto): Promise<{
        items: {
            id: string;
            name: string;
            description: string | null;
            type: EUserType;
            permissions: EPermission[];
            createdAt: Date;
            updatedAt: Date;
        }[];
        nextCursor: string | null;
    }>;
    getListPermissions(): {
        permissions: EPermission[];
    };
    updateRole(id: string, updatedRole: UpdateRoleDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        type: EUserType;
        permissions: EPermission[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteRole(id: string): Promise<{
        success: boolean;
    }>;
}
