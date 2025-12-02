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
        hashedPassword: newEntity.hashedPassword,
        address: newEntity.address,
        avatar: newEntity.avatar,
        birthdate: newEntity.birthdate,
        roleId: newEntity.roleId,
        createdAt: newEntity.createdAt,
        updatedAt: newEntity.updatedAt,
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
      include: options?.includeRole ? { role: true } : undefined,
    });
    return user ? this.toEntity(user) : null;
  }

  async findByEmail(
    email: string,
    options?: IUserJoinOptions,
  ): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: options?.includeRole ? { role: true } : undefined,
    });
    return user ? this.toEntity(user) : null;
  }

  async findAll(
    query: GetListUserDto,
    options?: IUserJoinOptions,
  ): Promise<UserEntity[]> {
    const filter: Prisma.UserWhereInput = {}
    if (query.type) {
      filter.role = { type: query.type }
    }
    if (query.roleId) {
      filter.roleId = query.roleId
    }
    const users = await this.prismaService.user.findMany({
      omit: { hashedPassword: true },
      take: query.limit,
      skip: query.cursor ? 1 : 0,
      where: filter,
      cursor: query.cursor ? { id: query.cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: options?.includeRole ? { role: true } : undefined,
    });
    return users.map((user) => this.toEntity(user));
  }

  async update(updatedEntity: UserEntity): Promise<UserEntity | null> {
    const updatedUser = await this.prismaService.user.update({
      where: { id: updatedEntity.id },
      data: {
        email: updatedEntity.email,
        name: updatedEntity.name,
        hashedPassword: updatedEntity.hashedPassword,
        address: updatedEntity.address,
        avatar: updatedEntity.avatar,
        birthdate: updatedEntity.birthdate,
        roleId: updatedEntity.roleId,
        updatedAt: updatedEntity.updatedAt,
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
      raw.hashedPassword,
      raw.name,
      raw.avatar,
      raw.gender,
      raw.birthdate,
      raw.address,
      raw.updatedAt,
      raw.createdAt,
      raw.roleId,
      raw.role
        ? new RoleEntity(
          raw.role.id,
          raw.role.name,
          raw.role.description,
          raw.role.type,
          raw.role.permissions,
          raw.role.createdAt,
          raw.role.updatedAt,
        )
        : undefined,
    );
  }
}
