import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { UserAdminController, UserClientController } from './controllers';

@Module({
  controllers: [UserClientController, UserAdminController],
  providers: [
    UserService,
    {
      provide: 'UserRepository',
      useClass: UserRepository
    }
  ],
  exports: ['UserRepository']
})
export class UserModule {}
