import { EPermission, EUserType } from '@/shared/enums';

export class RoleEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string | null,
    public readonly type: EUserType,
    public permissions: EPermission[],
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      permissions: this.permissions,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
