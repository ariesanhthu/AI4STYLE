import { EUserType } from '@/shared/enums';
import { IRoleRepository } from '@/core/role/interfaces';
import { RoleEntity } from '@/core/role/entities';
import { GetListRoleDto } from '@/application/role/dtos';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
export declare class PrismaRoleRepository implements IRoleRepository {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(newEntity: RoleEntity): Promise<RoleEntity>;
    findById(id: string): Promise<RoleEntity | null>;
    findByName(name: string): Promise<RoleEntity | null>;
    findByType(type: EUserType): Promise<RoleEntity | null>;
    findAll(query: GetListRoleDto): Promise<RoleEntity[]>;
    update(updatedEntity: RoleEntity): Promise<RoleEntity | null>;
    delete(id: string): Promise<boolean>;
    toEntity(raw: any): RoleEntity;
}
