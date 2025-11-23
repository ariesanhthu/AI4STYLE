export class OrderException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrderException';
  }
}

export class OrderNotFoundException extends OrderException {
  constructor(identifier: string) {
    super(`Order with identifier ${identifier} not found`);
    this.name = 'OrderNotFoundException';
  }
}

export class InvalidOrderStatusException extends OrderException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidOrderStatusException';
  }
}

export class OrderCancellationFailedException extends OrderException {
  constructor(reason: string) {
    super(`Failed to cancel order: ${reason}`);
    this.name = 'OrderCancellationFailedException';
  }
}

export class OrderCreationFailedException extends OrderException {
  constructor(reason: string) {
    super(`Failed to create order: ${reason}`);
    this.name = 'OrderCreationFailedException';
  }
}
