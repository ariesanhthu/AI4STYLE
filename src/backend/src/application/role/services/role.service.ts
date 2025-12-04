import { randomUUID } from 'crypto';
import { buildSearchString } from '@/shared/helpers';
import { CreateRoleDto, GetListRoleDto, PermissionResponseDto, UpdateRoleDto } from '../dtos';
import { EPermission, EUserType } from '@/shared/enums';
import { RoleEntity } from '@/core/role/entities';
import { type IRoleRepository } from '@/core/role/interfaces';
import { ILoggerService } from '@/shared/interfaces';
import {
  RoleAlreadyExistsException,
  RoleDeletionException,
  RoleNotFoundException,
  RoleUpdateException,
} from '@/core/role/exceptions';

export class RoleService {
  constructor(
    private readonly roleRepository: IRoleRepository,
    private readonly logger: ILoggerService,
  ) {
    this.logger.setContext(RoleService.name);
  }

  async createRole(newRole: CreateRoleDto) {
    try {
      const existed = await this.roleRepository.findByName(newRole.name);
      if (existed) {
        throw new RoleAlreadyExistsException(newRole.name);
      }

      const roleEntity = new RoleEntity(
        randomUUID(),
        newRole.name,
        newRole.description ?? '',
        EUserType.STAFF,
        newRole.permissions,
        buildSearchString(newRole.name, newRole.description ?? ''),
        new Date(),
        new Date(),
      );
      const createdRole = await this.roleRepository.create(roleEntity);
      this.logger.log(`Role created: ${createdRole.id}`);
      return createdRole.toJSON();
    } catch (error) {
      this.logger.error(`Failed to create role: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getRoleById(id: string) {
    try {
      const role = await this.roleRepository.findById(id);
      if (!role) {
        throw new RoleNotFoundException(id);
      }
      return role.toJSON();
    } catch (error) {
      this.logger.error(
        `Failed to get role by id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getRoleByName(name: string) {
    try {
      const role = await this.roleRepository.findByName(name);
      if (!role) {
        throw new RoleNotFoundException(name);
      }
      return role.toJSON();
    } catch (error) {
      this.logger.error(
        `Failed to get role by name ${name}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getListRoles(query: GetListRoleDto) {
    try {
      query.limit += 1;
      const roles = await this.roleRepository.findAll(query);
      const nextCursor =
        roles.length === query.limit ? roles[roles.length - 1].id : null;
      if (nextCursor) {
        roles.pop();
      }
      return {
        items: roles.map((role) => role.toJSON()),
        nextCursor,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get list of roles: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  getListPermissions() {
    const permissions: PermissionResponseDto = {
      permissions: Object.values(EPermission),
    };
    return permissions;
  }

  async updateRole(id: string, updatedRole: UpdateRoleDto) {
    try {
      const existingRole = await this.roleRepository.findById(id);
      if (!existingRole) {
        throw new RoleNotFoundException(id);
      }
      if (updatedRole.name) {
        const roleWithName = await this.roleRepository.findByName(
          updatedRole.name,
        );
        if (roleWithName && roleWithName.id !== id) {
          throw new RoleAlreadyExistsException(updatedRole.name);
        }
        existingRole.name = updatedRole.name;
      }
      if (updatedRole.description !== undefined) {
        existingRole.description = updatedRole.description;
      }
      existingRole.search = buildSearchString(
        existingRole.name,
        existingRole.description ?? '',
      );
      existingRole.updatedAt = new Date();
      const role = await this.roleRepository.update(existingRole);
      if (!role) {
        throw new RoleUpdateException(`Failed to update role with id ${id}`);
      }
      this.logger.log(`Role updated: ${id}`);
      return role.toJSON();
    } catch (error) {
      this.logger.error(
        `Failed to update role with id ${id}: ${error.message}`,
        error.stack,
      );
      if (
        error instanceof RoleNotFoundException ||
        error instanceof RoleAlreadyExistsException
      ) {
        throw error;
      }
      throw new RoleUpdateException(error.message);
    }
  }

  async deleteRole(id: string) {
    try {
      const deleted = await this.roleRepository.delete(id);
      if (!deleted) {
        throw new RoleDeletionException(`Failed to delete role with id ${id}`);
      }
      this.logger.log(`Role deleted: ${id}`);
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Failed to delete role with id ${id}: ${error.message}`,
        error.stack,
      );
      throw new RoleDeletionException(error.message);
    }
  }
}
