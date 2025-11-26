import { Module } from '@nestjs/common';
import {
  PAYMENT_REPOSITORY,
  PROVIDER_DISCOVERY,
  type IPaymentRepository,
  type IProviderDiscovery,
} from '@/core/payment/interfaces';
import {
  PaymentAdminController,
  PaymentClientController,
} from '@/presentation/controllers/payment';
import { PaymentService } from '@/application/payment/services';
import { InfrastructureModule } from '../infrastructure.module';
import { ILoggerService, LOGGER_SERVICE } from '@/shared/interfaces';
import { APP_FILTER } from '@nestjs/core';
import { PaymentExceptionFilter } from '../https/filters';
import { IUnitOfWork, UNIT_OF_WORK } from '@/application/shared';



@Module({
  imports: [InfrastructureModule],
  controllers: [PaymentClientController, PaymentAdminController],
  providers: [
    {
      provide: PaymentService,
      useFactory: (
        providerDiscoveryService: IProviderDiscovery,
        paymentRepository: IPaymentRepository,
        logger: ILoggerService,
        unitOfWork: IUnitOfWork
      ) => {
        return new PaymentService(
          providerDiscoveryService,
          paymentRepository,
          logger,
          unitOfWork
        );
      },
      inject: [
        PROVIDER_DISCOVERY,
        PAYMENT_REPOSITORY,
        LOGGER_SERVICE,
        UNIT_OF_WORK
      ],
    },
    {
      provide: APP_FILTER,
      useClass: PaymentExceptionFilter
    }
  ],
  exports: [PaymentService],
})
export class PaymentModule { }
