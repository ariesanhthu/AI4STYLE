"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderNotFoundException = exports.PaymentProviderNotFoundException = exports.InvalidPaymentStatusException = exports.PaymentRefundFailedException = exports.PaymentCaptureFailedException = exports.InvalidPaymentMethodException = exports.PaymentNotFoundException = exports.PaymentException = void 0;
class PaymentException extends Error {
    constructor(message) {
        super(message);
        this.name = 'PaymentException';
    }
}
exports.PaymentException = PaymentException;
class PaymentNotFoundException extends PaymentException {
    constructor(identifier) {
        super(`Payment with identifier ${identifier} not found`);
        this.name = 'PaymentNotFoundException';
    }
}
exports.PaymentNotFoundException = PaymentNotFoundException;
class InvalidPaymentMethodException extends PaymentException {
    constructor(message = 'Invalid payment method') {
        super(message);
        this.name = 'InvalidPaymentMethodException';
    }
}
exports.InvalidPaymentMethodException = InvalidPaymentMethodException;
class PaymentCaptureFailedException extends PaymentException {
    constructor(reason) {
        super(`Failed to capture payment: ${reason}`);
        this.name = 'PaymentCaptureFailedException';
    }
}
exports.PaymentCaptureFailedException = PaymentCaptureFailedException;
class PaymentRefundFailedException extends PaymentException {
    constructor(reason) {
        super(`Failed to refund payment: ${reason}`);
        this.name = 'PaymentRefundFailedException';
    }
}
exports.PaymentRefundFailedException = PaymentRefundFailedException;
class InvalidPaymentStatusException extends PaymentException {
    constructor(message) {
        super(message);
        this.name = 'InvalidPaymentStatusException';
    }
}
exports.InvalidPaymentStatusException = InvalidPaymentStatusException;
class PaymentProviderNotFoundException extends PaymentException {
    constructor(providerType) {
        super(`No provider found for payment method type: ${providerType}`);
        this.name = 'PaymentProviderNotFoundException';
    }
}
exports.PaymentProviderNotFoundException = PaymentProviderNotFoundException;
class OrderNotFoundException extends PaymentException {
    constructor(identifier) {
        super(`Order with identifier ${identifier} not found`);
        this.name = 'OrderNotFoundException';
    }
}
exports.OrderNotFoundException = OrderNotFoundException;
//# sourceMappingURL=payment.exception.js.map