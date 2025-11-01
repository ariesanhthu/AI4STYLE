import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { IRoleRepository } from "./role.repository.interface";
import { RoleEntity } from "../role.entity";
import { PaginationCursorQuery } from "../../shared/dtos";

@Injectable()
export class RoleRepository implements IRoleRepository {
  private readonly logger = new Logger(RoleRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(newEntity: RoleEntity): Promise<RoleEntity> {
    try {
      const created = await this.prisma.role.create({
        data: {
          id: newEntity.id,
          name: newEntity.name,
          description: newEntity.description,
          createdAt: newEntity.createdAt,
          updatedAt: newEntity.updatedAt,
        },
      });
      return this.toEntity(created);
    } catch (error) {
      this.logger.error(`Failed to create role: ${error.message}`);
      throw error;
    }
  }

  async findById(id: string): Promise<RoleEntity | null> {
    const role = await this.prisma.role.findUnique({ where: { id } });
    return role ? this.toEntity(role) : null;
  }

  async findByName(name: string): Promise<RoleEntity | null> {
    const role = await this.prisma.role.findUnique({ where: { name } });
    return role ? this.toEntity(role) : null;
  }

  async findAll(query: PaginationCursorQuery): Promise<RoleEntity[]> {
    const roles = await this.prisma.role.findMany({
      take: query.limit,
      skip: query.cursor ? 1 : 0,
      cursor: query.cursor ? { id: query.cursor } : undefined,
      orderBy: { createdAt: query.sortOrder },
    });
    return roles.map((role) => this.toEntity(role));
  }

  async update(updatedEntity: RoleEntity): Promise<RoleEntity | null> {
    try {
      const updated = await this.prisma.role.update({
        where: { id: updatedEntity.id },
        data: {
          name: updatedEntity.name,
          description: updatedEntity.description,
          updatedAt: updatedEntity.updatedAt,
        },
      });
      return this.toEntity(updated);
    } catch (error) {
      this.logger.error(`Failed to update role: ${error.message}`);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.role.delete({ where: { id } });
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete role: ${error.message}`);
      return false;
    }
  }
  
  toEntity(raw: any): RoleEntity {
    return new RoleEntity(
      raw.id,
      raw.name,
      raw.description,
      raw.createdAt,
      raw.updatedAt,
    );
  }
}