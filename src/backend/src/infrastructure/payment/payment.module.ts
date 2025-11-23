import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import {
  IProvider,
  PAYMENT_PROVIDERS,
  PAYMENT_REPOSITORY,
  PROVIDER_DISCOVERY,
  type IPaymentRepository,
  type IProviderDiscovery,
} from '@/core/payment/interfaces';
import { CashService } from './providers/cash.service';
import { MomoService } from './providers/momo.service';
import { PaymentMethodModule } from '../payment-method/payment-method.module';
import { OrderModule } from '../order/order.module';
import {
  PaymentAdminController,
  PaymentClientController,
} from '@/presentation/payment/controllers';
import { PaymentRepository } from './repositories';
import { ProviderDiscoveryService } from './providers/provider-discovery.service';
import { PaymentService } from '@/application/payment/services';
import { InfrastructureModule } from '../infrastructure.module';
import { ILoggerService, LOGGER_SERVICE } from '@/shared/interfaces';
import {
  PAYMENT_METHOD_REPOSITORY,
  type IPaymentMethodRepository,
} from '@/core/payment-method/interfaces';
import { OrderService } from '@/application/order/services';
import { APP_FILTER } from '@nestjs/core';
import { PaymentExceptionFilter } from '../https/filters';

const LIST_PAYMENT_PROVIDERS = [CashService, MomoService];

@Module({
  imports: [HttpModule, PaymentMethodModule, OrderModule, InfrastructureModule],
  controllers: [PaymentClientController, PaymentAdminController],
  providers: [
    ...LIST_PAYMENT_PROVIDERS,
    {
      provide: PAYMENT_PROVIDERS,
      useFactory: (...providers) => {
        const providerMap: { [key in string]: IProvider } = {};
        providers.forEach((provider) => {
          providerMap[provider.type] = provider;
        });
        return providerMap;
      },
      inject: LIST_PAYMENT_PROVIDERS,
    },
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PaymentRepository,
    },
    {
      provide: PROVIDER_DISCOVERY,
      useClass: ProviderDiscoveryService,
    },
    {
      provide: PaymentService,
      useFactory: (
        providerDiscoveryService: IProviderDiscovery,
        paymentMethodRepository: IPaymentMethodRepository,
        paymentRepository: IPaymentRepository,
        orderService: OrderService,
        logger: ILoggerService,
      ) => {
        return new PaymentService(
          providerDiscoveryService,
          paymentMethodRepository,
          paymentRepository,
          orderService,
          logger,
        );
      },
      inject: [
        PROVIDER_DISCOVERY,
        PAYMENT_METHOD_REPOSITORY,
        PAYMENT_REPOSITORY,
        OrderService,
        LOGGER_SERVICE,
      ],
    },
    {
      provide: APP_FILTER,
      useClass: PaymentExceptionFilter
    }    
  ],
  exports: [PaymentService, PROVIDER_DISCOVERY],
})
export class PaymentModule { }
