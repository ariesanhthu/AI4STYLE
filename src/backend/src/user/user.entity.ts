import { RoleEntity } from "../role/role.entity";

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public phone: string,
    public hashedPassword: string,
    public name: string,
    public avatar: string,
    public birthdate: Date,
    public address: string,
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
      birthdate: this.birthdate,
      address: this.address,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}