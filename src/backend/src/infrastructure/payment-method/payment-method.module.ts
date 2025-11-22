import { Module } from '@nestjs/common';
import { PaymentMethodRepository } from './repositories';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentMethodClientController } from '@/presentation/payment-method/controllers';
import { PaymentMethodService } from '@/application/payment-method/services';
import { PAYMENT_METHOD_REPOSITORY } from '@/core/payment-method/interfaces';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentMethodClientController],
  providers: [
    PaymentMethodService,
    {
      provide: PAYMENT_METHOD_REPOSITORY,
      useClass: PaymentMethodRepository,
    },
  ],
  exports: [PaymentMethodService, PAYMENT_METHOD_REPOSITORY],
})
export class PaymentMethodModule {}
