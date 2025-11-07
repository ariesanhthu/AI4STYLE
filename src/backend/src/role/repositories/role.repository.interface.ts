import { EUserType } from "../../shared/enums";
import { GetListRoleDto } from "../dtos";
import { RoleEntity } from "../role.entity";

export interface IRoleRepository {
  create(newEntity: RoleEntity): Promise<RoleEntity>;
  findById(id: string): Promise<RoleEntity | null>;
  findByName(name: string): Promise<RoleEntity | null>;
  findByType(type: EUserType): Promise<RoleEntity | null>;
  findAll(query: GetListRoleDto): Promise<RoleEntity[]>;
  update(updatedEntity: RoleEntity): Promise<RoleEntity | null>;
  delete(id: string): Promise<boolean>;
  toEntity(raw: any): RoleEntity;
}