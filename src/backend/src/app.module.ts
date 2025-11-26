import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './infrastructure/health/health.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ApiKeyGuard, JwtGuard, PermissionGuard } from './presentation/guards';
import { ResponseInterceptor } from './presentation/interceptors';
import { GlobalExceptionFilter } from './presentation/filters';
import { LoggerResponseTimeMiddleware } from './presentation/middlewares';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule, CategoryModule, OrderModule, PaymentMethodModule, PaymentModule, ProductModule, RoleModule, UploadModule, UserModule } from './infrastructure/modules';

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
    InfrastructureModule,
    PrismaModule,
    HealthModule,
    RoleModule,
    UserModule,
    AuthModule,
    UploadModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    PaymentMethodModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerResponseTimeMiddleware).forRoutes('*');
  }
}
