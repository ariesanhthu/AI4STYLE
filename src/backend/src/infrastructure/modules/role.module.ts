import { RoleAdminController } from '@/presentation/controllers/role';
import { Module } from '@nestjs/common';
import {
  ROLE_REPOSITORY,
  type IRoleRepository,
} from '@/core/role/interfaces';
import { RoleService } from '@/application/role/services';
import { InfrastructureModule } from '../infrastructure.module';
import { ILoggerService, LOGGER_SERVICE } from '@/shared/interfaces';
import { APP_FILTER } from '@nestjs/core';
import { RoleExceptionFilter } from '../https/filters';

@Module({
  imports: [InfrastructureModule],
  controllers: [RoleAdminController],
  providers: [
    {
      provide: RoleService,
      useFactory: (
        roleRepository: IRoleRepository,
        logger: ILoggerService,
      ) => {
        return new RoleService(roleRepository, logger);
      },
      inject: [ROLE_REPOSITORY, LOGGER_SERVICE],
    },
    {
      provide: APP_FILTER,
      useClass: RoleExceptionFilter
    }
  ],
  exports: [RoleService],
})
export class RoleModule { }
