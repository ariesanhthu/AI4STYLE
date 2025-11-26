import { Inject, Injectable } from '@nestjs/common';
import { IProviderGateway } from '@/core/payment/interfaces';
import { IProviderDiscovery, PAYMENT_PROVIDERS } from '@/core/payment/interfaces';
import { EPaymentMethod } from '@/core/payment-method/enums';

@Injectable()
export class ProviderDiscoveryService implements IProviderDiscovery {
  constructor(
    @Inject(PAYMENT_PROVIDERS)
    private readonly providers: { [key in EPaymentMethod]: IProviderGateway },
  ) {}

  getProvider(paymentType: EPaymentMethod) {
    return this.providers[paymentType];
  }
}
