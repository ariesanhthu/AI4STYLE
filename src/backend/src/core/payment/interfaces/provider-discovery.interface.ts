import { IProviderGateway } from './provider.interface';

export interface IProviderDiscovery {
  getProvider(paymentType: string): IProviderGateway;
}

export const PROVIDER_DISCOVERY = Symbol('IProviderDiscovery');
export const PAYMENT_PROVIDERS = Symbol('PAYMENT_PROVIDERS');
