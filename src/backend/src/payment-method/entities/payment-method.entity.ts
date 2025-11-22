import { EPaymentMethod } from '../enums';

export class PaymentMethodEntity {
  constructor(
    public readonly paymentMethodId: string,
    public displayName: string,
    public type: EPaymentMethod,
    public icon: string | null,
    public description: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  toJSON() {
    return {
      paymentMethodId: this.paymentMethodId,
      displayName: this.displayName,
      type: this.type,
      icon: this.icon,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}