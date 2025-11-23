import { PaymentMethodEntity } from '@/core/payment-method/entities';
import { EPaymentMethod } from '@/core/payment-method/enums';
import { randomUUID } from 'crypto';
import { type IPaymentMethodRepository } from '@/core/payment-method/interfaces';
import { ILoggerService } from '@/shared/interfaces';
import { PaymentMethodNotFoundException } from '@/core/payment-method/exceptions';

export class PaymentMethodService {
  constructor(
    private readonly paymentMethodRepository: IPaymentMethodRepository,
    private readonly logger: ILoggerService,
  ) {
    this.logger.setContext(PaymentMethodService.name);
  }

  async getPaymentMethodById(id: string) {
    try {
      const paymentMethod = await this.paymentMethodRepository.findById(id);
      if (!paymentMethod) {
        throw new PaymentMethodNotFoundException(id);
      }
      return paymentMethod.toJSON();
    } catch (error) {
      this.logger.error(
        `Failed to get payment method by id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getAllPaymentMethods() {
    try {
      const paymentMethods = await this.paymentMethodRepository.findAll();
      return paymentMethods.map((pm) => pm.toJSON());
    } catch (error) {
      this.logger.error(
        `Failed to get all payment methods: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async initializeDefaultPaymentMethods() {
    try {
      const existingMethods = await this.paymentMethodRepository.findAll();

      if (existingMethods.length === 0) {
        this.logger.log('Initializing default payment methods...');

        // Create Cash on Delivery method
        const codMethod = new PaymentMethodEntity(
          randomUUID(),
          'Cash on Delivery',
          EPaymentMethod.CASH_ON_DELIVERY,
          '💵',
          'Pay with cash when your order is delivered',
          new Date(),
          new Date(),
        );

        // Create MoMo method
        const momoMethod = new PaymentMethodEntity(
          randomUUID(),
          'MoMo E-Wallet',
          EPaymentMethod.MOMO,
          '🟣',
          'Pay with MoMo electronic wallet',
          new Date(),
          new Date(),
        );

        await this.paymentMethodRepository.create(codMethod);
        await this.paymentMethodRepository.create(momoMethod);

        this.logger.log('Default payment methods created successfully');
      } else {
        this.logger.log(
          `Found ${existingMethods.length} existing payment methods`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to initialize payment methods: ${error.message}`,
        error.stack,
      );
    }
  }
}
