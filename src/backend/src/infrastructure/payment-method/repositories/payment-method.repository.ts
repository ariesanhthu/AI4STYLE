import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentMethodEntity } from '@/core/payment-method/entities';
import { IPaymentMethodRepository } from '@/core/payment-method/interfaces';

@Injectable()
export class PaymentMethodRepository implements IPaymentMethodRepository {
  private readonly logger = new Logger(PaymentMethodRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<PaymentMethodEntity | null> {
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { payment_method_id: id },
    });
    return paymentMethod ? this.toEntity(paymentMethod) : null;
  }

  async findAll(): Promise<PaymentMethodEntity[]> {
    const paymentMethods = await this.prisma.paymentMethod.findMany({
      orderBy: { created_at: 'asc' },
    });
    return paymentMethods.map((pm) => this.toEntity(pm));
  }

  async create(
    paymentMethod: PaymentMethodEntity,
  ): Promise<PaymentMethodEntity> {
    const created = await this.prisma.paymentMethod.create({
      data: {
        payment_method_id: paymentMethod.paymentMethodId,
        display_name: paymentMethod.displayName,
        type: paymentMethod.type,
        icon: paymentMethod.icon,
        description: paymentMethod.description,
        created_at: paymentMethod.createdAt,
        updated_at: paymentMethod.updatedAt,
      },
    });
    return this.toEntity(created);
  }

  async update(
    paymentMethod: PaymentMethodEntity,
  ): Promise<PaymentMethodEntity> {
    const updated = await this.prisma.paymentMethod.update({
      where: { payment_method_id: paymentMethod.paymentMethodId },
      data: {
        display_name: paymentMethod.displayName,
        type: paymentMethod.type,
        icon: paymentMethod.icon,
        description: paymentMethod.description,
        updated_at: paymentMethod.updatedAt,
      },
    });
    return this.toEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.paymentMethod.delete({
      where: { payment_method_id: id },
    });
    return true;
  }

  private toEntity(raw: any): PaymentMethodEntity {
    return new PaymentMethodEntity(
      raw.payment_method_id,
      raw.display_name,
      raw.type,
      raw.icon,
      raw.description,
      raw.created_at,
      raw.updated_at,
    );
  }
}
