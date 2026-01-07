export interface MomoConfirmRequest {
    partnerCode: string;
    requestId: string;
    orderId: string;
    requestType: 'capture' | 'cancel';
    amount: number;
    lang?: 'vi' | 'en';
    description?: string;
    signature: string;
}
export interface MomoConfirmResponse {
    partnerCode: string;
    requestId: string;
    orderId: string;
    amount: number;
    transId: number;
    resultCode: number;
    message: string;
    requestType: 'capture' | 'cancel';
    responseTime: number;
}
