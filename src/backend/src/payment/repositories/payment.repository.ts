import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { IPaymentRepository } from './payment.repository.interface';
import { PaymentEntity, PaymentTransactionEntity } from '../entities';
import type { GetListOfPaymentsQueryDto } from '../dtos';

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  private readonly logger = new Logger(PaymentRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async createPayment(paymentData: PaymentEntity): Promise<PaymentEntity> {
    const created = await this.prisma.payment.create({
      data: {
        payment_id: paymentData.paymentId,
        order_id: paymentData.orderId,
        payment_method_id: paymentData.paymentMethodId,
        amount: paymentData.amount,
        type: paymentData.type,
        status: paymentData.status,
        created_at: paymentData.createdAt,
        updated_at: paymentData.updatedAt,
      },
      include: {
        transactions: true,
      },
    });

    return this.toPaymentEntity(created);
  }

  async createPaymentTransaction(
    transactionData: PaymentTransactionEntity,
  ): Promise<PaymentTransactionEntity> {
    const created = await this.prisma.paymentTransaction.create({
      data: {
        transaction_id: transactionData.transactionId,
        payment_id: transactionData.paymentId,
        request_body: transactionData.requestBody,
        response_body: transactionData.responseBody,
        type: transactionData.type,
        created_at: transactionData.createdAt,
        updated_at: transactionData.updatedAt,
      },
    });

    return this.toTransactionEntity(created);
  }

  async updatePayment(
    updateData: PaymentEntity,
  ): Promise<PaymentEntity> {
    const updated = await this.prisma.payment.update({
      where: { payment_id: updateData.paymentId },
      data: {
        payment_method_id: updateData.paymentMethodId,
        type: updateData.type,
        status: updateData.status,
        updated_at: updateData.updatedAt,
      },
      include: {
        transactions: true,
      },
    });

    return this.toPaymentEntity(updated);
  }

  async getPaymentById(paymentId: string): Promise<PaymentEntity | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { payment_id: paymentId },
      include: {
        transactions: {
          orderBy: {
            created_at: 'asc',
          },
        },
      },
    });

    if (!payment) return null;

    return this.toPaymentEntity(payment);
  }

  async getPaymentByOrderId(orderId: string): Promise<PaymentEntity | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { order_id: orderId },
      include: {
        transactions: {
          orderBy: {
            created_at: 'asc',
          },
        },
      },
    });

    if (!payment) return null;

    return this.toPaymentEntity(payment);
  }

  async getPaymentsList(query: GetListOfPaymentsQueryDto): Promise<PaymentEntity[]> {
    const whereClause: any = {};

    // Filter by status if provided
    if (query.status) {
      whereClause.status = query.status;
    }

    // Filter by payment method type if provided
    if (query.type) {
      whereClause.type = query.type;
    }

    // Filter by date range if provided
    if (query.startDate || query.endDate) {
      whereClause.created_at = {};
      if (query.startDate) {
        whereClause.created_at.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        whereClause.created_at.lte = new Date(query.endDate);
      }
    }

    const payments = await this.prisma.payment.findMany({
      take: query.limit,
      skip: query.cursor ? 1 : 0,
      cursor: query.cursor ? { payment_id: query.cursor } : undefined,
      where: whereClause,
      orderBy: { created_at: query.sortOrder || 'desc' },
      include: {
        transactions: {
          orderBy: {
            created_at: 'asc',
          },
        },
      },
    });

    return payments.map((payment) => this.toPaymentEntity(payment));
  }

  private toPaymentEntity(payment: any): PaymentEntity {
    return new PaymentEntity(
      payment.payment_id,
      payment.order_id,
      payment.payment_method_id,
      payment.amount,
      payment.type,
      payment.status,
      payment.created_at,
      payment.updated_at,
      payment.transactions?.map((t: any) => this.toTransactionEntity(t)),
    );
  }

  private toTransactionEntity(transaction: any): PaymentTransactionEntity {
    return new PaymentTransactionEntity(
      transaction.transaction_id,
      transaction.payment_id,
      transaction.request_body,
      transaction.response_body,
      transaction.type,
      transaction.created_at,
      transaction.updated_at,
    );
  }
}
