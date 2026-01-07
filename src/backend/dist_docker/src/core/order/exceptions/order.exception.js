"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCreationFailedException = exports.OrderCancellationFailedException = exports.InvalidOrderStatusException = exports.OrderNotFoundException = exports.OrderException = void 0;
class OrderException extends Error {
    constructor(message) {
        super(message);
        this.name = 'OrderException';
    }
}
exports.OrderException = OrderException;
class OrderNotFoundException extends OrderException {
    constructor(identifier) {
        super(`Order with identifier ${identifier} not found`);
        this.name = 'OrderNotFoundException';
    }
}
exports.OrderNotFoundException = OrderNotFoundException;
class InvalidOrderStatusException extends OrderException {
    constructor(message) {
        super(message);
        this.name = 'InvalidOrderStatusException';
    }
}
exports.InvalidOrderStatusException = InvalidOrderStatusException;
class OrderCancellationFailedException extends OrderException {
    constructor(reason) {
        super(`Failed to cancel order: ${reason}`);
        this.name = 'OrderCancellationFailedException';
    }
}
exports.OrderCancellationFailedException = OrderCancellationFailedException;
class OrderCreationFailedException extends OrderException {
    constructor(reason) {
        super(`Failed to create order: ${reason}`);
        this.name = 'OrderCreationFailedException';
    }
}
exports.OrderCreationFailedException = OrderCreationFailedException;
//# sourceMappingURL=order.exception.js.map