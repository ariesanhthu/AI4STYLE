import { RoleEntity } from '@/core/role/entities';
import { EGender } from '../enums';

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public phone: string,
    public hashedPassword: string,
    public name: string,
    public avatar: string,
    public gender: EGender,
    public birthdate: Date,
    public address: string,
    public search: string,
    public updatedAt: Date,
    public readonly createdAt: Date,
    public readonly roleId: string,
    public readonly role?: RoleEntity,
  ) {}

  toJSON() {
    return {
      id: this.id,
      roleId: this.roleId,
      role: this.role ? this.role.toJSON() : undefined,
      name: this.name,
      email: this.email,
      phone: this.phone,
      avatar: this.avatar,
      gender: this.gender,
      birthdate: this.birthdate,
      address: this.address,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
