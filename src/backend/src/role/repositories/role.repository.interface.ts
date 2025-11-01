import { PaginationCursorQuery } from "../../shared/dtos";
import { RoleEntity } from "../role.entity";

export interface IRoleRepository {
  create(newEntity: RoleEntity): Promise<RoleEntity>;
  findById(id: string): Promise<RoleEntity | null>;
  findByName(name: string): Promise<RoleEntity | null>;
  findAll(query: PaginationCursorQuery): Promise<RoleEntity[]>;
  update(updatedEntity: RoleEntity): Promise<RoleEntity | null>;
  delete(id: string): Promise<boolean>;
  toEntity(raw: any): RoleEntity;
}