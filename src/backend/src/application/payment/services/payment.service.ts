import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
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
  PAYMENT_REPOSITORY,
  PROVIDER_DISCOVERY,
} from '@/core/payment/interfaces';
import {
  type IPaymentMethodRepository,
  PAYMENT_METHOD_REPOSITORY,
} from '@/core/payment-method/interfaces';
import { PaymentEntity } from '@/core/payment/entities';
import { EPaymentMethod } from '@/core/payment-method/enums';
import { EOrderStatus } from '@/core/order/enums';
import { EPaymentStatus } from '@/core/payment/enums';
import { GeneralIpn } from '@/infrastructure/payment/interfaces';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @Inject(PROVIDER_DISCOVERY)
    private readonly providerDiscoveryService: IProviderDiscovery,
    @Inject(PAYMENT_METHOD_REPOSITORY)
    private readonly paymentMethodRepository: IPaymentMethodRepository,
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    private readonly orderService: OrderService,
  ) {}

  async createPayment(body: CreatePaymentDto) {
    try {
      const paymentMethod = await this.paymentMethodRepository.findById(
        body.paymentMethodId,
      );
      if (!paymentMethod) {
        throw new BadRequestException('Invalid payment method ID');
      }

      const order = await this.orderService.getById(body.orderId);

      // Check if payment already exists for this order
      let existingPayment = await this.paymentRepository.getPaymentByOrderId(
        body.orderId,
      );

      if (existingPayment) {
        // Payment exists - check if we can create a new attempt
        if (!existingPayment.canCreateNewAttempt()) {
          throw new BadRequestException(
            `Cannot create new payment attempt. Payment status is ${existingPayment.status}. Only PENDING payments can have new attempts.`,
          );
        }

        // Cancel the last pending attempt if exists
        existingPayment.cancelLastPendingAttempt();

        // Update the canceled attempt in DB if needed
        const lastAttempt = existingPayment.getLatestAttempt();
        if (lastAttempt && lastAttempt.status === EPaymentStatus.CANCELED) {
          await this.paymentRepository.updatePaymentAttempt(lastAttempt);
        }

        // Get next order number for new attempt
        const nextOrderNumber = existingPayment.getNextAttemptOrderNumber();

        // Create new attempt via provider
        const provider = this.providerDiscoveryService.getProvider(
          paymentMethod.type,
        );
        if (!provider || !provider.create) {
          throw new BadRequestException(
            'No provider found for the specified payment method type',
          );
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

        await this.paymentRepository.updatePayment(existingPayment);

        if (paymentMethod.type === EPaymentMethod.CASH_ON_DELIVERY) {
          await this.orderService.updateOrderStatus(order.orderId, {
            status: EOrderStatus.PENDING,
          });
        }

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
          await this.paymentRepository.createPaymentWithAttempt(
            newPayment,
            null as any, // Will be created by provider
          );

        // Create initial attempt via provider
        const provider = this.providerDiscoveryService.getProvider(
          paymentMethod.type,
        );
        if (!provider || !provider.create) {
          throw new BadRequestException(
            'No provider found for the specified payment method type',
          );
        }

        const paymentResponse = await provider.create(
          createdPayment.paymentId,
          1, // First attempt
          paymentMethod,
          order.totalPrice,
        );

        if (paymentMethod.type === EPaymentMethod.CASH_ON_DELIVERY) {
          await this.orderService.updateOrderStatus(order.orderId, {
            status: EOrderStatus.PENDING,
          });
        }

        return paymentResponse;
      }
    } catch (error) {
      this.logger.error('Error creating payment', error);
      throw error;
    }
  }

  async cancelPayment(paymentId: string) {
    try {
      const payment = await this.paymentRepository.getPaymentById(paymentId);
      if (!payment) {
        throw new BadRequestException('Payment not found');
      }
      const provider = this.providerDiscoveryService.getProvider(payment.type);
      if (!provider || !provider.cancel) {
        throw new BadRequestException(
          'No provider found for the specified payment method type',
        );
      }
      const paymentResponse = await provider.cancel(payment);

      paymentResponse.status = EPaymentStatus.CANCELED;
      await this.paymentRepository.updatePayment(paymentResponse);

      return paymentResponse;
    } catch (error) {
      this.logger.error('Error canceling payment', error);
      throw error;
    }
  }

  async refundPayment(paymentId: string) {
    try {
      const payment = await this.paymentRepository.getPaymentById(paymentId);
      if (!payment) {
        throw new BadRequestException('Payment not found');
      }
      if (payment.status !== EPaymentStatus.CAPTURED) {
        throw new BadRequestException('Only CAPTURED payments can be refunded');
      }

      const provider = this.providerDiscoveryService.getProvider(payment.type);
      if (!provider || !provider.refund) {
        throw new BadRequestException(
          'No provider found for the specified payment method type',
        );
      }
      const paymentResponse = await provider.refund(payment);

      paymentResponse.status = EPaymentStatus.REFUNDED;
      await this.paymentRepository.updatePayment(paymentResponse);

      return paymentResponse;
    } catch (error) {
      this.logger.error('Error canceling payment', error);
      throw error;
    }
  }

  async capturePayment(paymentId: string) {
    try {
      const payment = await this.paymentRepository.getPaymentById(paymentId);
      if (!payment) {
        throw new BadRequestException('Payment not found');
      }
      const provider = this.providerDiscoveryService.getProvider(payment.type);
      if (!provider || !provider.capture) {
        throw new BadRequestException(
          'No provider found for the specified payment method type',
        );
      }
      const paymentResponse = await provider.capture(payment);

      return paymentResponse;
    } catch (error) {
      this.logger.error('Error capturing payment', error);
      throw error;
    }
  }

  async handleProviderWebhook(type: EPaymentMethod, payload: GeneralIpn) {
    try {
      const provider: IProviderGateway =
        this.providerDiscoveryService.getProvider(type);
      if (!provider || !provider.handleIPN) {
        throw new BadRequestException(
          'No provider found for the specified payment method type',
        );
      }
      const { response, payment } = await provider.handleIPN(payload);
      return response;
    } catch (error) {
      this.logger.error('Error handling provider webhook', error);
      throw error;
    }
  }

  async getPaymentById(paymentId: string) {
    const payment = await this.paymentRepository.getPaymentById(paymentId);
    if (!payment) {
      throw new BadRequestException('Payment not found');
    }
    return payment.toJSON();
  }

  async getListOfPayments(query: GetListOfPaymentsQueryDto) {
    try {
      const payments = await this.paymentRepository.getPaymentsList(query);

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
      this.logger.error('Error retrieving list of payments', error);
      throw error;
    }
  }
}
