import { GetListUserDto } from "../dtos/get-list-user.dto";
import { UserEntity } from "../user.entity";

export interface UserJoinOptions {
  includeRole?: boolean;
}

export interface IUserRepository {
  create(newEntity: UserEntity): Promise<UserEntity>;
  findById(id: string, options?: UserJoinOptions): Promise<UserEntity | null>;
  findByEmail(email: string, options?: UserJoinOptions): Promise<UserEntity | null>;
  findAll(query: GetListUserDto, options?: UserJoinOptions): Promise<UserEntity[]>;
  update(updatedEntity: UserEntity): Promise<UserEntity | null>;
  delete(id: string): Promise<boolean>;
  toEntity(raw: any): UserEntity;
}