import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoleModule } from '../role/role.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthAdminController } from './controllers/auth-admin.controller';
import { AuthClientController } from './controllers';

@Module({
  imports: [
    UserModule,
    RoleModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService]
    }),
  ],
  controllers: [AuthAdminController, AuthClientController],
  providers: [
    AuthService,
    JwtStrategy
  ]
})
export class AuthModule {}
