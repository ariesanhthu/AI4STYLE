import { IProviderGateway } from '@/core/payment/interfaces';
import { IProviderDiscovery } from '@/core/payment/interfaces';
import { EPaymentMethod } from '@/core/payment-method/enums';
export declare class ProviderDiscoveryService implements IProviderDiscovery {
    private readonly providers;
    constructor(providers: {
        [key in EPaymentMethod]: IProviderGateway;
    });
    getProvider(paymentType: EPaymentMethod): IProviderGateway;
}
