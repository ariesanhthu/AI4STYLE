import { Inject, Injectable } from '@nestjs/common';
import { IProviderGateway } from '@/core/payment/interfaces/provider.interface';
import { PAYMENT_PROVIDERS } from '@/core/payment/interfaces/provider-discovery.interface';
import { EPaymentMethod } from '@/core/payment-method/enums';

@Injectable()
export class ProviderDiscoveryService {
  constructor(
    @Inject(PAYMENT_PROVIDERS)
    private readonly providers: { [key in EPaymentMethod]: IProviderGateway },
  ) {}

  getProvider(paymentType: EPaymentMethod) {
    return this.providers[paymentType];
  }
}
