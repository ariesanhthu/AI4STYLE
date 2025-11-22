import { Inject, Injectable } from "@nestjs/common";
import { IProvider } from "../../interfaces";
import { CreatePaymentDto, CreatePaymentResponseDto } from "../../dtos";
import { PaymentEntity } from "../../entities";
import { EPaymentMethod } from "../../../payment-method/enums";
import { PaymentMethodEntity } from "../../../payment-method/entities";
import { randomUUID } from "crypto";
import { EPaymentStatus } from "../../enums";
import { type IPaymentRepository } from "../../repositories";

@Injectable()
export class CashService implements IProvider {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
  ) {}
  type = EPaymentMethod.CASH_ON_DELIVERY;

  async create(data: CreatePaymentDto, paymentMethod: PaymentMethodEntity, amount: number): Promise<CreatePaymentResponseDto> {
    const payment = new PaymentEntity(
      randomUUID(),
      data.orderId,
      paymentMethod.paymentMethodId,
      amount,
      this.type,
      EPaymentStatus.PENDING,
      new Date(),
      new Date(),
    );

    const createdPayment = await this.paymentRepository.createPayment(payment);

    return { payUrl: null };
  }

  async capture(payment: PaymentEntity): Promise<PaymentEntity> {
    payment.status = EPaymentStatus.CAPTURED;
    payment.updatedAt = new Date();

    const updatedPayment = await this.paymentRepository.updatePayment(payment);

    return updatedPayment;
  }

  async refund(payment: PaymentEntity): Promise<PaymentEntity> {
    payment.status = EPaymentStatus.REFUNDED;
    payment.updatedAt = new Date();

    const updatedPayment = await this.paymentRepository.updatePayment(payment);

    return updatedPayment;
  }

  async cancel(payment: PaymentEntity): Promise<PaymentEntity> {
    payment.status = EPaymentStatus.CANCELED;
    payment.updatedAt = new Date();

    const updatedPayment = await this.paymentRepository.updatePayment(payment);

    return updatedPayment;
  }
}