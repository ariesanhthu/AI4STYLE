import { Module } from '@nestjs/common';
import { RoleController } from './role-admin.controller';
import { RoleService } from './role.service';
import { RoleRepository } from './repositories/role.repository';

@Module({
  controllers: [RoleController],
  providers: [
    {
      provide: 'RoleRepository',
      useClass: RoleRepository,
    },
    RoleService
  ],
  exports: ['RoleRepository']
})
export class RoleModule {}
