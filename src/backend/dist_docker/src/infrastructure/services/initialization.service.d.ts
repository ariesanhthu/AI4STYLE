import { OnModuleInit } from '@nestjs/common';
import { type IRoleRepository } from '@/core/role/interfaces/';
import { ConfigService } from '@nestjs/config';
import { type IUserRepository } from '@/core/user/interfaces';
export declare class InitializationService implements OnModuleInit {
    private readonly roleRepository;
    private readonly userRepository;
    private readonly configService;
    private readonly logger;
    constructor(roleRepository: IRoleRepository, userRepository: IUserRepository, configService: ConfigService);
    onModuleInit(): Promise<void>;
    initializeRoles(): Promise<void>;
    initializeAdmin(): Promise<void>;
}
