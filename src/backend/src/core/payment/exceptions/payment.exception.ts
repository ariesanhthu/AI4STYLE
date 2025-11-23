export class PaymentException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentException';
  }
}

export class PaymentNotFoundException extends PaymentException {
  constructor(identifier: string) {
    super(`Payment with identifier ${identifier} not found`);
    this.name = 'PaymentNotFoundException';
  }
}

export class InvalidPaymentMethodException extends PaymentException {
  constructor(message: string = 'Invalid payment method') {
    super(message);
    this.name = 'InvalidPaymentMethodException';
  }
}

export class PaymentCaptureFailedException extends PaymentException {
  constructor(reason: string) {
    super(`Failed to capture payment: ${reason}`);
    this.name = 'PaymentCaptureFailedException';
  }
}

export class PaymentRefundFailedException extends PaymentException {
  constructor(reason: string) {
    super(`Failed to refund payment: ${reason}`);
    this.name = 'PaymentRefundFailedException';
  }
}

export class InvalidPaymentStatusException extends PaymentException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPaymentStatusException';
  }
}

export class PaymentProviderNotFoundException extends PaymentException {
  constructor(providerType: string) {
    super(`No provider found for payment method type: ${providerType}`);
    this.name = 'PaymentProviderNotFoundException';
  }
}
