export declare class OrderException extends Error {
    constructor(message: string);
}
export declare class OrderNotFoundException extends OrderException {
    constructor(identifier: string);
}
export declare class InvalidOrderStatusException extends OrderException {
    constructor(message: string);
}
export declare class OrderCancellationFailedException extends OrderException {
    constructor(reason: string);
}
export declare class OrderCreationFailedException extends OrderException {
    constructor(reason: string);
}
