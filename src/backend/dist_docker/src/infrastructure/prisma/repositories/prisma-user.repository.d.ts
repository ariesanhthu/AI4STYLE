import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { UserEntity } from '@/core/user/entities';
import { IUserJoinOptions, IUserRepository } from '@/core/user/interfaces';
import { GetListUserDto } from '@/application/user/dtos';
export declare class PrismaUserRepository implements IUserRepository {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    create(newEntity: UserEntity): Promise<UserEntity>;
    findById(id: string, options?: IUserJoinOptions): Promise<UserEntity | null>;
    findByEmail(email: string, options?: IUserJoinOptions): Promise<UserEntity | null>;
    findAll(query: GetListUserDto, options?: IUserJoinOptions): Promise<UserEntity[]>;
    update(updatedEntity: UserEntity): Promise<UserEntity | null>;
    delete(id: string): Promise<boolean>;
    toEntity(raw: any): UserEntity;
}
