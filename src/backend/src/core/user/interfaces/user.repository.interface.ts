import { UserEntity } from '../entities';

export interface IUserJoinOptions {
  includeRole?: boolean;
}

export interface IUserRepository {
  create(newEntity: UserEntity): Promise<UserEntity>;
  findById(id: string, options?: IUserJoinOptions): Promise<UserEntity | null>;
  findByEmail(
    email: string,
    options?: IUserJoinOptions,
  ): Promise<UserEntity | null>;
  findAll(
    query: Record<string, any>,
    options?: IUserJoinOptions,
  ): Promise<UserEntity[]>;
  update(updatedEntity: UserEntity): Promise<UserEntity | null>;
  delete(id: string): Promise<boolean>;
  toEntity(raw: any): UserEntity;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
