"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodAlreadyExistsException = exports.PaymentMethodNotFoundException = exports.PaymentMethodException = void 0;
class PaymentMethodException extends Error {
    constructor(message) {
        super(message);
        this.name = 'PaymentMethodException';
    }
}
exports.PaymentMethodException = PaymentMethodException;
class PaymentMethodNotFoundException extends PaymentMethodException {
    constructor(identifier) {
        super(`Payment method with identifier ${identifier} not found`);
        this.name = 'PaymentMethodNotFoundException';
    }
}
exports.PaymentMethodNotFoundException = PaymentMethodNotFoundException;
class PaymentMethodAlreadyExistsException extends PaymentMethodException {
    constructor(identifier) {
        super(`Payment method with identifier ${identifier} already exists`);
        this.name = 'PaymentMethodAlreadyExistsException';
    }
}
exports.PaymentMethodAlreadyExistsException = PaymentMethodAlreadyExistsException;
//# sourceMappingURL=payment-method.exception.js.map