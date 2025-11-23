export class PaymentMethodException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentMethodException';
  }
}

export class PaymentMethodNotFoundException extends PaymentMethodException {
  constructor(identifier: string) {
    super(`Payment method with identifier ${identifier} not found`);
    this.name = 'PaymentMethodNotFoundException';
  }
}

export class PaymentMethodAlreadyExistsException extends PaymentMethodException {
  constructor(identifier: string) {
    super(`Payment method with identifier ${identifier} already exists`);
    this.name = 'PaymentMethodAlreadyExistsException';
  }
}
