export interface MomoRefundRequest {
    partnerCode: string;
    orderId: string;
    requestId: string;
    amount: number;
    transId: number;
    lang?: 'vi' | 'en';
    description?: string;
    transGroup?: MomoRefundItem[];
    signature: string;
}
export interface MomoRefundItem {
    itemId: string;
    amount: number;
    transId: number;
}
export interface MomoRefundResponse {
    partnerCode: string;
    requestId: string;
    orderId: string;
    amount: number;
    resultCode: number;
    message: string;
    transId?: number;
    responseTime: number;
    signature: string;
}
