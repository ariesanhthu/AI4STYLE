import { Module } from "@nestjs/common";
import { PaymentMethodClientController } from "./controllers";
import { PaymentMethodService } from "./services";
import { PaymentMethodRepository } from "./repositories/payment-method.repository";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [PaymentMethodClientController],
  providers: [
    PaymentMethodService,
    {
      provide: "PaymentMethodRepository",
      useClass: PaymentMethodRepository,
    }
  ],
  exports: [PaymentMethodService, "PaymentMethodRepository"],
})
export class PaymentMethodModule {}
