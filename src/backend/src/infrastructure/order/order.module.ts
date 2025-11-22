import { Module } from '@nestjs/common';
import { OrderRepository } from './repositories/order.repository';
import { ProductModule } from '../product/product.module';
import { PrismaModule } from '../prisma/prisma.module';
import { OrderService } from '@/application/order/services';
import {
  OrderAdminController,
  OrderClientController,
} from '@/presentation/order/controllers';
import { ORDER_REPOSITORY } from '@/core/order/interfaces';

@Module({
  imports: [ProductModule, PrismaModule],
  controllers: [OrderAdminController, OrderClientController],
  providers: [
    OrderService,
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderRepository,
    },
  ],
  exports: [OrderService, ORDER_REPOSITORY],
})
export class OrderModule {}
