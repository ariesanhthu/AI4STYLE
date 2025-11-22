import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from '@/application/auth/services';
import { AuthAdminController } from '@/presentation/auth/controllers/auth-admin.controller';
import { AuthClientController } from '@/presentation/auth/controllers';
import { JwtStrategy } from './strategies';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    UserModule,
    RoleModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthAdminController, AuthClientController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
