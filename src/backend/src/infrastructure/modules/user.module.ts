import { Module } from '@nestjs/common';
import { UserService } from '@/application/user/services';
import {
  UserAdminController,
  UserClientController,
} from '@/presentation/controllers/user';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '@/core/user/interfaces';
import { InfrastructureModule } from '../infrastructure.module';
import { ILoggerService, LOGGER_SERVICE } from '@/shared/interfaces';
import { APP_FILTER } from '@nestjs/core';
import { UserExceptionFilter } from '../https/filters';

@Module({
  imports: [InfrastructureModule],
  controllers: [UserClientController, UserAdminController],
  providers: [
    {
      provide: UserService,
      useFactory: (
        userRepository: IUserRepository,
        logger: ILoggerService,
      ) => {
        return new UserService(userRepository, logger);
      },
      inject: [USER_REPOSITORY, LOGGER_SERVICE],
    },
    {
      provide: APP_FILTER,
      useClass: UserExceptionFilter
    }
  ],
  exports: [UserService],
})
export class UserModule { }
