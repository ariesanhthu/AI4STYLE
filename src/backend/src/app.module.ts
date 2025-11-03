import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { ApiKeyGuard, JwtGuard, RoleGuard } from './shared/guards';
import { ResponseInterceptor } from './shared/interceptors';
import { GlobalExceptionFilter } from './shared/filters';
import { PrismaModule } from './prisma/prisma.module';
import { RoleModule } from './role/role.module';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: `.env`, 
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<number>('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    RoleModule,
    UserModule,
    AuthModule
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: JwtGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: ApiKeyGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: RoleGuard,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ResponseInterceptor,
    },
    {
      provide: 'APP_FILTER',
      useClass: GlobalExceptionFilter,
    }
  ],
})
export class AppModule {}
