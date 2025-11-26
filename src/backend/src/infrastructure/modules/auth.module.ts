import { Module } from '@nestjs/common';
import { AuthService } from '@/application/auth/services';
import { AuthAdminController } from '@/presentation/controllers/auth/auth-admin.controller';
import { AuthClientController } from '@/presentation/controllers/auth';
import { USER_REPOSITORY, IUserRepository } from '@/core/user/interfaces';
import { ROLE_REPOSITORY, IRoleRepository } from '@/core/role/interfaces';
import {
  CACHE_SERVICE,
  ICacheService,
  ILoggerService,
  ITokenService,
  LOGGER_SERVICE,
  TOKEN_SERVICE,
} from '@/shared/interfaces';
import { InfrastructureModule } from '../infrastructure.module';
import { APP_FILTER } from '@nestjs/core';
import { AuthExceptionFilter } from '../https/filters';

@Module({
  imports: [
    InfrastructureModule,
  ],
  controllers: [AuthAdminController, AuthClientController],
  providers: [
    {
      provide: AuthService,
      useFactory: (
        userRepository: IUserRepository,
        roleRepository: IRoleRepository,
        tokenService: ITokenService,
        cacheService: ICacheService,
        loggerService: ILoggerService,
      ) => {
        return new AuthService(
          userRepository,
          roleRepository,
          tokenService,
          cacheService,
          loggerService,
        );
      },
      inject: [
        USER_REPOSITORY,
        ROLE_REPOSITORY,
        TOKEN_SERVICE,
        CACHE_SERVICE,
        LOGGER_SERVICE,
      ],
    },
    {
      provide: APP_FILTER,
      useClass: AuthExceptionFilter
    }
  ],
})
export class AuthModule { }
