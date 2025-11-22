import { RoleController } from '@/presentation/role/controllers';
import { Module } from '@nestjs/common';
import { RoleRepository } from './repositories/role.repository';
import { ROLE_REPOSITORY } from '@/core/role/interfaces';
import { RoleService } from '@/application/role/services';

@Module({
  controllers: [RoleController],
  providers: [
    {
      provide: ROLE_REPOSITORY,
      useClass: RoleRepository,
    },
    RoleService,
  ],
  exports: [RoleService, ROLE_REPOSITORY],
})
export class RoleModule {}
