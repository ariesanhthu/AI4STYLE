import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { PaymentMethodEntity } from '@/core/payment-method/entities';
import { IPaymentMethodRepository } from '@/core/payment-method/interfaces';
export declare class PrismaPaymentMethodRepository implements IPaymentMethodRepository {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<PaymentMethodEntity | null>;
    findAll(): Promise<PaymentMethodEntity[]>;
    create(paymentMethod: PaymentMethodEntity): Promise<PaymentMethodEntity>;
    update(paymentMethod: PaymentMethodEntity): Promise<PaymentMethodEntity>;
    delete(id: string): Promise<boolean>;
    private toEntity;
}
