import { Module } from "@nestjs/common";
import { OrderAdminController, OrderClientController } from "./controllers";
import { OrderService } from "./services";
import { OrderRepository } from "./repositories/order.repository";
import { ProductModule } from "../product/product.module";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [ProductModule, PrismaModule],
  controllers: [OrderAdminController, OrderClientController],
  providers: [
    OrderService,
    {
      provide: "OrderRepository",
      useClass: OrderRepository,
    }
  ],
  exports: [OrderService, "OrderRepository"],
})
export class OrderModule {}
