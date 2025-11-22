import { Inject, Injectable } from "@nestjs/common";
import { IProvider, IProviderGateway } from "../../interfaces/provider.interface";
import { EPaymentMehod } from "@prisma/client";

@Injectable()
export class ProviderDiscoveryService {
  constructor(
    @Inject('PAYMENT_PROVIDERS') private readonly providers: { [key in EPaymentMehod]: IProviderGateway }
  ) {}

  getProvider(paymentType: EPaymentMehod) {
    return this.providers[paymentType];
  }
}