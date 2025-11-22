import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserService } from '@/application/user/services';
import {
  UserAdminController,
  UserClientController,
} from '@/presentation/user/controllers';
import { USER_REPOSITORY } from '@/core/user/interfaces';

@Module({
  controllers: [UserClientController, UserAdminController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
