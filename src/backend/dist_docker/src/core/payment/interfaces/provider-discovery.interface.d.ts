import { IProviderGateway } from './provider.interface';
export interface IProviderDiscovery {
    getProvider(paymentType: string): IProviderGateway;
}
export declare const PROVIDER_DISCOVERY: unique symbol;
export declare const PAYMENT_PROVIDERS: unique symbol;
