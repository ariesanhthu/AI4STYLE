import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import type { IRoleRepository } from "./repositories/role.repository.interface";
import { RoleEntity } from "./role.entity";
import { randomUUID } from "crypto";
import { ERole, ESortOrder } from "../shared/enums";
import { PaginationCursorQueryDto } from "../shared/dtos";
import { CreateRoleDto, UpdateRoleDto } from "./dtos";

@Injectable()
export class RoleService implements OnModuleInit {
  private readonly logger = new Logger(RoleService.name);
  constructor(
    @Inject("RoleRepository") private readonly roleRepository: IRoleRepository,
  ) {}

  async createRole(newRole: CreateRoleDto) {
    const existed = await this.roleRepository.findByName(newRole.name);
    if (existed) {
      throw new Error(`Role with name ${newRole.name} already exists`);
    }
    const roleEntity = new RoleEntity(
      randomUUID(),
      newRole.name,
      newRole.description ?? "",
      new Date(),
      new Date(),
    );
    return (await this.roleRepository.create(roleEntity)).toJSON();
  }

  async getRoleById(id: string) {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new Error(`Role with id ${id} not found`);
    }
    return role.toJSON();
  }

  async getRoleByName(name: string) {
    const role = await this.roleRepository.findByName(name);
    if (!role) {
      throw new Error(`Role with name ${name} not found`);
    }
    return role.toJSON();
  }

  async getListRoles(query: PaginationCursorQueryDto) {
    query.limit += 1;
    const roles = await this.roleRepository.findAll(query);
    const nextCursor = roles.length === query.limit
      ? roles[roles.length - 1].id
      : null;
    if (nextCursor) {
      roles.pop();
    }
    return {
      items: roles.map(role => role.toJSON()),
      nextCursor
    };
  }

  async updateRole(id: string, updatedRole: UpdateRoleDto) {
    const existingRole = await this.roleRepository.findById(id);
    if (!existingRole) {
      throw new Error(`Role with id ${id} not found`);
    }
    if (updatedRole.name) {
      const roleWithName = await this.roleRepository.findByName(updatedRole.name);
      if (roleWithName && roleWithName.id !== id) {
        throw new Error(`Role with name ${updatedRole.name} already exists`);
      }
      existingRole.name = updatedRole.name;
    }
    if (updatedRole.description !== undefined) {
      existingRole.description = updatedRole.description;
    }
    existingRole.updatedAt = new Date();
    const role = await this.roleRepository.update(existingRole);
    if (!role) {
      throw new Error(`Failed to update role with id ${id}`);
    }
    return role.toJSON();
  }

  async deleteRole(id: string) {
    const deleted = await this.roleRepository.delete(id);
    if (!deleted) {
      throw new Error(`Failed to delete role with id ${id}`);
    }
    return { success: true };
  }

  async onModuleInit() {
    this.logger.log("RoleService initialized");
    let flagExistAdmin = false;
    let flagExistGuest = false;
    const entities = await this.roleRepository.findAll({ limit: 100, cursor: null, sortOrder: ESortOrder.DESC });
    if (entities) {
      entities.forEach((entity) => {
        if (entity.name === ERole.ADMIN) {
          flagExistAdmin = true;
        }
        if (entity.name === ERole.GUEST) {
          flagExistGuest = true;
        }
      });
    }

    if (!flagExistAdmin) {
      await this.roleRepository.create(new RoleEntity(
        randomUUID(),
        ERole.ADMIN,
        "Administrator with full access",
        new Date(),
        new Date(),
      ));
    }

    if (!flagExistGuest) {
      await this.roleRepository.create(new RoleEntity(
          randomUUID(),
          ERole.GUEST,
          "Guest user with limited access",
          new Date(),
          new Date(),
      ));
    }
  }
}