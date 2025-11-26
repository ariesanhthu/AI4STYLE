import { Module } from '@nestjs/common';
import { PaymentMethodClientController } from '@/presentation/controllers/payment-method';
import { PaymentMethodService } from '@/application/payment-method/services';
import {
  PAYMENT_METHOD_REPOSITORY,
  type IPaymentMethodRepository,
} from '@/core/payment-method/interfaces';
import { InfrastructureModule } from '../infrastructure.module';
import { ILoggerService, LOGGER_SERVICE } from '@/shared/interfaces';
import { APP_FILTER } from '@nestjs/core';
import { PaymentMethodExceptionFilter } from '../https/filters';

@Module({
  imports: [InfrastructureModule],
  controllers: [PaymentMethodClientController],
  providers: [
    {
      provide: PaymentMethodService,
      useFactory: (
        paymentMethodRepository: IPaymentMethodRepository,
        logger: ILoggerService,
      ) => {
        return new PaymentMethodService(paymentMethodRepository, logger);
      },
      inject: [PAYMENT_METHOD_REPOSITORY, LOGGER_SERVICE],
    },
    {
      provide: APP_FILTER,
      useClass: PaymentMethodExceptionFilter
    }
  ],
  exports: [PaymentMethodService],
})
export class PaymentMethodModule { }
