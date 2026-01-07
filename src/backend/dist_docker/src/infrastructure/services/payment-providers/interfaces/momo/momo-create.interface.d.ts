export interface MomoCreateRequest {
    partnerCode: string;
    subPartnerCode?: string;
    storeName: string;
    storeId: string;
    requestId: string;
    amount: number;
    orderId: string;
    orderInfo: string;
    orderGroupId?: number;
    redirectUrl: string;
    ipnUrl: string;
    requestType: 'payWithMethod' | 'captureWallet';
    extraData?: string;
    items?: MomoItem[];
    deliveryInfo?: MomoDeliveryInfo;
    userInfo?: MomoUserInfo;
    referenceId?: string;
    autoCapture?: boolean;
    lang?: 'vi' | 'en';
    signature: string;
}
export interface MomoItem {
    id: string;
    name: string;
    description: string;
    category: string;
    imageUrl: string;
    manufacturer: string;
    price: number;
    currency: string;
    quantity: number;
    unit: string;
    totalPrice: number;
    taxAmount: number;
}
export interface MomoDeliveryInfo {
    deliveryAddress: string;
    deliveryFee: string;
    quantity: string;
}
export interface MomoUserInfo {
    name: string;
    phoneNumber: string;
    email: string;
}
export interface MomoCreateResponse {
    partnerCode: string;
    requestId: string;
    orderId: string;
    amount: number;
    responseTime: number;
    message: string;
    resultCode: number;
    payUrl: string;
    deeplink?: string;
    qrCodeUrl?: string;
    deeplinkMiniApp?: string;
    userFee?: number;
    promotionInfo?: MomoPromotionInfo[] | null;
    signature: string;
}
export interface MomoPromotionInfo {
    amount: number;
    amountSponsor: number;
    voucherId: string;
    voucherType: string;
    voucherName: string;
    merchantRate: string;
}
