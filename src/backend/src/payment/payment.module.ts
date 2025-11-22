import { Module } from '@nestjs/common';
import { PaymentService } from './services/payment.service';
import { CashService, MomoService, ProviderDiscoveryService } from './services';
import { HttpModule } from '@nestjs/axios';
import { IProvider } from './interfaces';
import { PaymentMethodModule } from '../payment-method/payment-method.module';
import { PaymentAdminController, PaymentClientController } from './controllers';
import { EPaymentMethod } from '../payment-method/enums';
import { PaymentRepository } from './repositories';
import { OrderModule } from '../order/order.module';

const PAYMENT_PROVIDERS = [
  CashService,
  MomoService,
];

@Module({
  imports: [
    HttpModule,
    PaymentMethodModule,
    OrderModule,
  ],
  controllers: [PaymentClientController, PaymentAdminController],
  providers: [
    ...PAYMENT_PROVIDERS,
    {
      provide: 'PAYMENT_PROVIDERS',
      useFactory: (...providers) => {
        const providerMap: { [key in string]: IProvider } = {};
        providers.forEach(provider => {
          providerMap[provider.type] = provider;
        });
        return providerMap;
      },
      inject: PAYMENT_PROVIDERS,
    },
    {
      provide: 'PaymentRepository',
      useClass: PaymentRepository,
    },
    ProviderDiscoveryService,
    PaymentService, 
  ],
  exports: [ProviderDiscoveryService],
})
export class PaymentModule {}
