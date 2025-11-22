import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import type { IPaymentMethodRepository } from "../repositories";
import { PaymentMethodEntity } from "../entities";
import { EPaymentMethod } from "../enums";
import { randomUUID } from "crypto";

@Injectable()
export class PaymentMethodService implements OnModuleInit {
  private readonly logger = new Logger(PaymentMethodService.name);

  constructor(
    @Inject('PaymentMethodRepository')
    private readonly paymentMethodRepository: IPaymentMethodRepository,
  ) {}

  async onModuleInit() {
    await this.initializeDefaultPaymentMethods();
  }

  async getPaymentMethodById(id: string) {
    const paymentMethod = await this.paymentMethodRepository.findById(id);
    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }
    return paymentMethod.toJSON();
  }

  async getAllPaymentMethods() {
    const paymentMethods = await this.paymentMethodRepository.findAll();
    return paymentMethods.map((pm) => pm.toJSON());
  }

  private async initializeDefaultPaymentMethods() {
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
        this.logger.log(`Found ${existingMethods.length} existing payment methods`);
      }
    } catch (error) {
      this.logger.error(`Failed to initialize payment methods: ${error.message}`);
    }
  }
}