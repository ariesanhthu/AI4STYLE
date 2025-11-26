import { Inject, Injectable } from '@nestjs/common';
import {
  CreatePaymentDto,
  CreatePaymentResponseDto,
} from '@/application/payment/dtos';
import {
  PaymentEntity,
  PaymentAttemptEntity,
} from '@/core/payment/entities';
import { EPaymentMethod } from '@/core/payment-method/enums';
import { PaymentMethodEntity } from '@/core/payment-method/entities';
import { randomUUID } from 'crypto';
import { EPaymentStatus } from '@/core/payment/enums';
import {
  type IPaymentRepository,
  IProvider,
  PAYMENT_REPOSITORY,
} from '@/core/payment/interfaces';

@Injectable()
export class CashService implements IProvider {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
  ) { }
  type = EPaymentMethod.CASH_ON_DELIVERY;

  async create(
    paymentId: string,
    orderNumber: number,
    paymentMethod: PaymentMethodEntity,
    amount: number,
  ): Promise<CreatePaymentResponseDto> {
    // Create a new payment attempt
    const attempt = new PaymentAttemptEntity(
      randomUUID(),
      paymentId,
      paymentMethod.paymentMethodId,
      this.type,
      orderNumber,
      EPaymentStatus.PENDING,
      new Date(),
      new Date(),
    );

    await this.paymentRepository.createAttempt(attempt);

    return { payUrl: null };
  }

  async capture(payment: PaymentEntity): Promise<PaymentEntity> {
    // Get the latest attempt and update its status
    const latestAttempt = payment.getLatestAttempt();
    if (!latestAttempt) {
      throw new Error('No payment attempt found to capture');
    }

    latestAttempt.status = EPaymentStatus.CAPTURED;
    latestAttempt.updatedAt = new Date();
    await this.paymentRepository.updateAttempt(latestAttempt);

    // Sync payment status from the attempt
    payment.syncStatusFromLatestAttempt();
    const updatedPayment = await this.paymentRepository.update(payment);

    return updatedPayment;
  }

  async refund(payment: PaymentEntity): Promise<PaymentEntity> {
    // Get the latest attempt and update its status
    const latestAttempt = payment.getLatestAttempt();
    if (!latestAttempt) {
      throw new Error('No payment attempt found to refund');
    }

    latestAttempt.status = EPaymentStatus.REFUNDED;
    latestAttempt.updatedAt = new Date();
    await this.paymentRepository.updateAttempt(latestAttempt);

    // Sync payment status from the attempt
    payment.syncStatusFromLatestAttempt();
    const updatedPayment = await this.paymentRepository.update(payment);

    return updatedPayment;
  }

  async cancel(payment: PaymentEntity): Promise<PaymentEntity> {
    // Get the latest attempt and update its status
    const latestAttempt = payment.getLatestAttempt();
    if (!latestAttempt) {
      throw new Error('No payment attempt found to cancel');
    }

    latestAttempt.status = EPaymentStatus.CANCELED;
    latestAttempt.updatedAt = new Date();
    await this.paymentRepository.updateAttempt(latestAttempt);

    // Sync payment status from the attempt
    payment.syncStatusFromLatestAttempt();
    const updatedPayment = await this.paymentRepository.update(payment);

    return updatedPayment;
  }
}
