import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { UserEntity } from '@/core/user/entities';
import { IUserJoinOptions, IUserRepository } from '@/core/user/interfaces';
import { GetListUserDto } from '@/application/user/dtos';
import { RoleEntity } from '@/core/role/entities';
import { Prisma } from '../generated/client';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) { }

  async create(newEntity: UserEntity): Promise<UserEntity> {
    const createdUser = await this.prismaService.user.create({
      data: {
        id: newEntity.id,
        email: newEntity.email,
        name: newEntity.name,
        hashed_password: newEntity.hashedPassword,
        address: newEntity.address,
        avatar: newEntity.avatar,
        birthdate: newEntity.birthdate,
        phone: newEntity.phone,
        gender: newEntity.gender,
        search: newEntity.search,
        role_id: newEntity.roleId,
        created_at: newEntity.createdAt,
        updated_at: newEntity.updatedAt,
      },
    });
    return this.toEntity(createdUser);
  }

  async findById(
    id: string,
    options?: IUserJoinOptions,
  ): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: options?.includeRole ? { roles: true } : undefined,
    });
    return user ? this.toEntity(user) : null;
  }

  async findByEmail(
    email: string,
    options?: IUserJoinOptions,
  ): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: options?.includeRole ? { roles: true } : undefined,
    });
    return user ? this.toEntity(user) : null;
  }

  async findAll(
    query: GetListUserDto,
    options?: IUserJoinOptions,
  ): Promise<UserEntity[]> {
    const filter: Prisma.UserWhereInput = {}
    if (query.type) {
      filter.roles = { type: query.type }
    }
    if (query.roleId) {
      filter.role_id = query.roleId
    }
    if (query.search) {
      filter.search = { contains: query.search }
    }
    const users = await this.prismaService.user.findMany({
      omit: { hashed_password: true },
      take: query.limit,
      skip: query.cursor ? 1 : 0,
      where: filter,
      cursor: query.cursor ? { id: query.cursor } : undefined,
      orderBy: { created_at: 'desc' },
      include: options?.includeRole ? { roles: true } : undefined,
    });
    return users.map((user) => this.toEntity(user));
  }

  async update(updatedEntity: UserEntity): Promise<UserEntity | null> {
    const updatedUser = await this.prismaService.user.update({
      where: { id: updatedEntity.id },
      data: {
        email: updatedEntity.email,
        name: updatedEntity.name,
        hashed_password: updatedEntity.hashedPassword,
        address: updatedEntity.address,
        avatar: updatedEntity.avatar,
        birthdate: updatedEntity.birthdate,
        phone: updatedEntity.phone,
        gender: updatedEntity.gender,
        search: updatedEntity.search,
        role_id: updatedEntity.roleId,
        updated_at: updatedEntity.updatedAt,
      },
    });
    return this.toEntity(updatedUser);
  }

  async delete(id: string): Promise<boolean> {
    await this.prismaService.user.delete({
      where: { id },
    });
    return true;
  }

  toEntity(raw: any): UserEntity {
    return new UserEntity(
      raw.id,
      raw.email,
      raw.phone,
      raw.hashed_password,
      raw.name,
      raw.avatar,
      raw.gender,
      raw.birthdate,
      raw.address,
      raw.search,
      raw.updated_at,
      raw.created_at,
      raw.role_id,
      raw.roles
        ? new RoleEntity(
          raw.roles.id,
          raw.roles.name,
          raw.roles.description,
          raw.roles.type,
          raw.roles.permissions,
          raw.roles.search,
          raw.roles.created_at,
          raw.roles.updated_at,
        )
        : undefined,
    );
  }
}
