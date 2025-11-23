import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { HealthModule } from './infrastructure/health/health.module';
import { RoleModule } from '@/infrastructure/role/role.module';
import { UserModule } from '@/infrastructure/user/user.module';
import { AuthModule } from '@/infrastructure/auth/auth.module';
import { UploadModule } from '@/infrastructure/upload/upload.module';
import { CategoryModule } from '@/infrastructure/category/category.module';
import { ProductModule } from '@/infrastructure/product/product.module';
import { OrderModule } from '@/infrastructure/order/order.module';
import { PaymentMethodModule } from '@/infrastructure/payment-method/payment-method.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ApiKeyGuard, JwtGuard, PermissionGuard } from './shared/guards';
import { ResponseInterceptor } from './shared/interceptors';
import { GlobalExceptionFilter } from './shared/filters';
import { LoggerResponseTimeMiddleware } from './shared/middlewares';
import { PaymentModule } from './infrastructure/payment/payment.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

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
