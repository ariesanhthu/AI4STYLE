export declare class PaymentException extends Error {
    constructor(message: string);
}
export declare class PaymentNotFoundException extends PaymentException {
    constructor(identifier: string);
}
export declare class InvalidPaymentMethodException extends PaymentException {
    constructor(message?: string);
}
export declare class PaymentCaptureFailedException extends PaymentException {
    constructor(reason: string);
}
export declare class PaymentRefundFailedException extends PaymentException {
    constructor(reason: string);
}
export declare class InvalidPaymentStatusException extends PaymentException {
    constructor(message: string);
}
export declare class PaymentProviderNotFoundException extends PaymentException {
    constructor(providerType: string);
}
export declare class OrderNotFoundException extends PaymentException {
    constructor(identifier: string);
}
