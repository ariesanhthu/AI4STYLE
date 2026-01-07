import { MomoPromotionInfo } from './momo-create.interface';
export interface MomoIpn {
    partnerCode: string;
    orderId: string;
    requestId: string;
    amount: number;
    orderInfo?: string;
    orderType?: string;
    transId: number;
    resultCode: number;
    message: string;
    payType: string;
    responseTime: number;
    extraData?: string;
    signature: string;
    paymentOption?: string;
    userFee?: number;
    promotionInfo?: MomoPromotionInfo;
}
