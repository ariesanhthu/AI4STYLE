import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { ProviderDiscoveryService } from "./providers/provider-discovery.service";
import { CreatePaymentDto, GetListOfPaymentsQueryDto } from "../dtos";
import type { IPaymentMethodRepository } from "../../payment-method/repositories";
import type { IPaymentRepository } from "../repositories";
import { GeneralIpn, IProviderGateway } from "../interfaces";
import { EPaymentMehod } from "@prisma/client";
import { OrderService } from "../../order/services";
import { EOrderStatus } from "../../order/enums";

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly providerDiscoveryService: ProviderDiscoveryService,
    @Inject('PaymentMethodRepository')
    private readonly paymentMethodRepository: IPaymentMethodRepository,
    @Inject('PaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
    private readonly orderService: OrderService,
  ) {}

  async createPayment(body: CreatePaymentDto) {
    try {
      const paymentMethod = await this.paymentMethodRepository.findById(body.paymentMethodId);
      if (!paymentMethod) {
        throw new BadRequestException('Invalid payment method ID');
      }

      const order = await this.orderService.getById(body.orderId);

      const provider = this.providerDiscoveryService.getProvider(paymentMethod.type);
      if (!provider || !provider.create) {
        throw new BadRequestException('No provider found for the specified payment method type');
      }
      const paymentResponse = await provider.create(body, paymentMethod, order.totalPrice);
      if (paymentMethod.type === EPaymentMehod.CASH_ON_DELIVERY) {
        await this.orderService.updateOrderStatus(order.orderId, { status: EOrderStatus.PENDING });
      }
      return paymentResponse;
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
        throw new BadRequestException('No provider found for the specified payment method type');
      }
      const paymentResponse = await provider.cancel(payment);
      return paymentResponse;
    } catch (error) {
      this.logger.error('Error canceling payment', error);
      throw error;
    }
  }

  async refundPayment(paymentId: string, amount: number) {}

  async capturePayment(paymentId: string) {
    try {
      const payment = await this.paymentRepository.getPaymentById(paymentId);
      if (!payment) {
        throw new BadRequestException('Payment not found');
      }
      const provider = this.providerDiscoveryService.getProvider(payment.type);
      if (!provider || !provider.capture) {
        throw new BadRequestException('No provider found for the specified payment method type');
      }
      const paymentResponse = await provider.capture(payment);
      
      return paymentResponse;
    } catch (error) {
      this.logger.error('Error capturing payment', error);
      throw error;
    }
  }

  async handleProviderWebhook(type: EPaymentMehod, payload: GeneralIpn) {
    try {
      const provider: IProviderGateway = this.providerDiscoveryService.getProvider(type);
      if (!provider || !provider.handleIPN) {
        throw new BadRequestException('No provider found for the specified payment method type');
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