import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import {
  IProvider,
  PAYMENT_PROVIDERS,
  PAYMENT_REPOSITORY,
  PROVIDER_DISCOVERY,
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

const LIST_PAYMENT_PROVIDERS = [CashService, MomoService];

@Module({
  imports: [HttpModule, PaymentMethodModule, OrderModule],
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
    PaymentService,
  ],
  exports: [PaymentService, PROVIDER_DISCOVERY],
})
export class PaymentModule {}
