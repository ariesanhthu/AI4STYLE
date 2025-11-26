import { Module } from '@nestjs/common';
import { OrderService } from '@/application/order/services';
import {
  OrderAdminController,
  OrderClientController,
} from '@/presentation/controllers/order';
import {
  type IOrderRepository,
  ORDER_REPOSITORY,
} from '@/core/order/interfaces';
import { InfrastructureModule } from '../infrastructure.module';
import { ILoggerService, LOGGER_SERVICE } from '@/shared/interfaces';
import { APP_FILTER } from '@nestjs/core';
import { OrderExceptionFilter } from '../https/filters';
import { IUnitOfWork, UNIT_OF_WORK } from '@/application/shared';

@Module({
  imports: [InfrastructureModule],
  controllers: [OrderAdminController, OrderClientController],
  providers: [
    {
      provide: OrderService,
      useFactory: (
        orderRepository: IOrderRepository,
        logger: ILoggerService,
        unitOfWork: IUnitOfWork,
      ) => {
        return new OrderService(
          orderRepository,
          logger,
          unitOfWork,
        );
      },
      inject: [
        ORDER_REPOSITORY,
        LOGGER_SERVICE,
        UNIT_OF_WORK,
      ],
    },
    {
      provide: APP_FILTER,
      useClass: OrderExceptionFilter
    }
  ],
  exports: [OrderService],
})
export class OrderModule { }
