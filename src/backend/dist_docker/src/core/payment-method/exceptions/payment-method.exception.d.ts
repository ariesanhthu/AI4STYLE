export declare class PaymentMethodException extends Error {
    constructor(message: string);
}
export declare class PaymentMethodNotFoundException extends PaymentMethodException {
    constructor(identifier: string);
}
export declare class PaymentMethodAlreadyExistsException extends PaymentMethodException {
    constructor(identifier: string);
}
