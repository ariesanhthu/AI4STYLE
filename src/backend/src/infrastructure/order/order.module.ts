import { Module } from '@nestjs/common';
import { OrderRepository } from './repositories/order.repository';
import { ProductModule } from '../product/product.module';
import { PrismaModule } from '../prisma/prisma.module';
import { OrderService } from '@/application/order/services';
import {
  OrderAdminController,
  OrderClientController,
} from '@/presentation/order/controllers';
import {
  type IOrderRepository,
  ORDER_REPOSITORY,
} from '@/core/order/interfaces';
import { InfrastructureModule } from '../infrastructure.module';
import { ILoggerService, LOGGER_SERVICE } from '@/shared/interfaces';
import { PrismaService } from '../prisma/prisma.service';
import { ProductService } from '@/application/product/services';
import { APP_FILTER } from '@nestjs/core';
import { OrderExceptionFilter } from '../https/filters';

@Module({
  imports: [ProductModule, PrismaModule, InfrastructureModule],
  controllers: [OrderAdminController, OrderClientController],
  providers: [
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderRepository,
    },
    {
      provide: OrderService,
      useFactory: (
        orderRepository: IOrderRepository,
        prisma: PrismaService,
        productService: ProductService,
        logger: ILoggerService,
      ) => {
        return new OrderService(
          orderRepository,
          prisma,
          productService,
          logger,
        );
      },
      inject: [
        ORDER_REPOSITORY,
        PrismaService,
        ProductService,
        LOGGER_SERVICE,
      ],
    },
    {
      provide: APP_FILTER,
      useClass: OrderExceptionFilter
    }    
  ],
  exports: [OrderService, ORDER_REPOSITORY],
})
export class OrderModule { }
