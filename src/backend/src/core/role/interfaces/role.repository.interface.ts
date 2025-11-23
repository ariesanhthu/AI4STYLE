import { EUserType } from '@/shared/enums';
import { RoleEntity } from '../entities';

export interface IRoleRepository {
  create(newEntity: RoleEntity): Promise<RoleEntity>;
  findById(id: string): Promise<RoleEntity | null>;
  findByName(name: string): Promise<RoleEntity | null>;
  findByType(type: EUserType): Promise<RoleEntity | null>;
  findAll(query: Record<string, any>): Promise<RoleEntity[]>;
  update(updatedEntity: RoleEntity): Promise<RoleEntity | null>;
  delete(id: string): Promise<boolean>;
  toEntity(raw: any): RoleEntity;
}

export const ROLE_REPOSITORY = Symbol('IRoleRepository');
