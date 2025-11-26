import {
  CreatePaymentDto,
  GetListOfPaymentsQueryDto,
} from '@/application/payment/dtos';
import { OrderService } from '@/application/order/services';
import { randomUUID } from 'crypto';
import {
  type IPaymentRepository,
  type IProviderDiscovery,
  IProviderGateway,
} from '@/core/payment/interfaces';
import { type IPaymentMethodRepository } from '@/core/payment-method/interfaces';
import { PaymentEntity } from '@/core/payment/entities';
import { EPaymentMethod } from '@/core/payment-method/enums';
import { EOrderStatus } from '@/core/order/enums';
import { EPaymentStatus } from '@/core/payment/enums';
import { GeneralIpn } from '@/infrastructure/services/payment-providers/interfaces';
import { ILoggerService } from '@/shared/interfaces';
import {
  InvalidPaymentMethodException,
  InvalidPaymentStatusException,
  OrderNotFoundException,
  PaymentNotFoundException,
  PaymentProviderNotFoundException,
} from '@/core/payment/exceptions';
import { IUnitOfWork } from '@/application/shared';

export class PaymentService {
  constructor(
    private readonly providerDiscoveryService: IProviderDiscovery,
    private readonly paymentRepository: IPaymentRepository,
    private readonly logger: ILoggerService,
    private readonly unitOfWork: IUnitOfWork
  ) {
    this.logger.setContext(PaymentService.name);
  }

  async createPayment(body: CreatePaymentDto) {
    const session = await this.unitOfWork.start();
    try {
      const paymentMethod = await session.paymentMethodRepository.findById(
        body.paymentMethodId,
      );
      if (!paymentMethod) {
        throw new InvalidPaymentMethodException('Invalid payment method ID');
      }

      const order = await session.orderRepository.findById(body.orderId);
      if (!order) {
        throw new OrderNotFoundException(body.orderId);
      }

      // Check if payment already exists for this order
      let existingPayment = await session.paymentRepository.findByOrderId(
        body.orderId,
      );

      if (existingPayment) {
        // Payment exists - check if we can create a new attempt
        if (!existingPayment.canCreateNewAttempt()) {
          throw new InvalidPaymentStatusException(
            `Cannot create new payment attempt. Payment status is ${existingPayment.status}. Only PENDING payments can have new attempts.`,
          );
        }

        // Cancel the last pending attempt if exists
        existingPayment.cancelLastPendingAttempt();

        // Update the canceled attempt in DB if needed
        const lastAttempt = existingPayment.getLatestAttempt();
        if (lastAttempt && lastAttempt.status === EPaymentStatus.CANCELED) {
          await session.paymentRepository.updateAttempt(lastAttempt);
        }

        // Get next order number for new attempt
        const nextOrderNumber = existingPayment.getNextAttemptOrderNumber();

        // Create new attempt via provider
        const provider = this.providerDiscoveryService.getProvider(
          paymentMethod.type,
        );
        if (!provider || !provider.create) {
          throw new PaymentProviderNotFoundException(paymentMethod.type);
        }

        const paymentResponse = await provider.create(
          existingPayment.paymentId,
          nextOrderNumber,
          paymentMethod,
          order.totalPrice,
        );

        existingPayment.type = paymentMethod.type;
        existingPayment.paymentMethodId = paymentMethod.paymentMethodId;
        existingPayment.updatedAt = new Date();

        await session.paymentRepository.update(existingPayment);

        if (paymentMethod.type === EPaymentMethod.CASH_ON_DELIVERY) {
          order.status = EOrderStatus.PENDING;
          await session.orderRepository.update(order.orderId, order);
        }

        await session.commit();
        return paymentResponse;
      } else {
        // No existing payment - create new payment first
        const newPayment = new PaymentEntity(
          randomUUID(),
          body.orderId,
          paymentMethod.paymentMethodId,
          order.totalPrice,
          paymentMethod.type,
          EPaymentStatus.PENDING,
          new Date(),
          new Date(),
        );

        const createdPayment =
          await session.paymentRepository.createWithAttempt(
            newPayment,
            null as any, // Will be created by provider
          );

        // Create initial attempt via provider
        const provider = this.providerDiscoveryService.getProvider(
          paymentMethod.type,
        );
        if (!provider || !provider.create) {
          throw new PaymentProviderNotFoundException(paymentMethod.type);
        }

        const paymentResponse = await provider.create(
          createdPayment.paymentId,
          1, // First attempt
          paymentMethod,
          order.totalPrice,
        );

        if (paymentMethod.type === EPaymentMethod.CASH_ON_DELIVERY) {
          order.status = EOrderStatus.PENDING;
          await session.orderRepository.update(order.orderId, order);
        }

        await session.commit();
        return paymentResponse;
      }
    } catch (error) {
      await session.rollback();
      this.logger.error(
        `Error creating payment: ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      await session.end();
    }
  }

  async cancelPayment(paymentId: string) {
    const session = await this.unitOfWork.start();
    try {
      const payment = await session.paymentRepository.findById(paymentId);
      if (!payment) {
        throw new PaymentNotFoundException(paymentId);
      }
      const provider = this.providerDiscoveryService.getProvider(payment.type);
      if (!provider || !provider.cancel) {
        throw new PaymentProviderNotFoundException(payment.type);
      }
      const paymentResponse = await provider.cancel(payment);

      paymentResponse.status = EPaymentStatus.CANCELED;
      await session.paymentRepository.update(paymentResponse);

      await session.commit();
      return paymentResponse;
    } catch (error) {
      await session.rollback();
      this.logger.error(
        `Error canceling payment: ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      await session.end();
    }
  }

  async refundPayment(paymentId: string) {
    const session = await this.unitOfWork.start();
    try {
      const payment = await session.paymentRepository.findById(paymentId);
      if (!payment) {
        throw new PaymentNotFoundException(paymentId);
      }
      if (payment.status !== EPaymentStatus.CAPTURED) {
        throw new InvalidPaymentStatusException(
          'Only CAPTURED payments can be refunded',
        );
      }

      const provider = this.providerDiscoveryService.getProvider(payment.type);
      if (!provider || !provider.refund) {
        throw new PaymentProviderNotFoundException(payment.type);
      }
      const paymentResponse = await provider.refund(payment);

      paymentResponse.status = EPaymentStatus.REFUNDED;
      await session.paymentRepository.update(paymentResponse);

      await session.commit();
      return paymentResponse;
    } catch (error) {
      await session.rollback();
      this.logger.error(
        `Error refunding payment: ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      await session.end();
    }
  }

  async capturePayment(paymentId: string) {
    const session = await this.unitOfWork.start();
    try {
      const payment = await session.paymentRepository.findById(paymentId);
      if (!payment) {
        throw new PaymentNotFoundException(paymentId);
      }
      const provider = this.providerDiscoveryService.getProvider(payment.type);
      if (!provider || !provider.capture) {
        throw new PaymentProviderNotFoundException(payment.type);
      }
      const paymentResponse = await provider.capture(payment);

      paymentResponse.status = EPaymentStatus.CAPTURED;
      await session.paymentRepository.update(paymentResponse);

      await session.commit();
      return paymentResponse;
    } catch (error) {
      await session.rollback();
      this.logger.error(
        `Error capturing payment: ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      await session.end();
    }
  }

  async handleProviderWebhook(type: EPaymentMethod, payload: GeneralIpn) {
    const session = await this.unitOfWork.start();
    try {
      const provider: IProviderGateway =
        this.providerDiscoveryService.getProvider(type);
      if (!provider || !provider.handleIPN) {
        throw new PaymentProviderNotFoundException(type);
      }
      const { response, payment } = await provider.handleIPN(payload);
      await session.commit();
      return response;
    } catch (error) {
      await session.rollback();
      this.logger.error(
        `Error handling provider webhook: ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      await session.end();
    }
  }

  async getPaymentById(paymentId: string) {
    try {
      const payment = await this.paymentRepository.findById(paymentId);
      if (!payment) {
        throw new PaymentNotFoundException(paymentId);
      }
      return payment.toJSON();
    } catch (error) {
      this.logger.error(
        `Error getting payment by id: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getListOfPayments(query: GetListOfPaymentsQueryDto) {
    try {
      const payments = await this.paymentRepository.findAll(query);

      // Calculate next cursor
      let nextCursor: string | null = null;
      if (payments.length > query.limit) {
        const nextItem = payments.pop();
        nextCursor = nextItem?.paymentId || null;
      }

      return {
        items: payments.map((payment) => payment.toJSON()),
        nextCursor,
      };
    } catch (error) {
      this.logger.error(
        `Error retrieving list of payments: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
