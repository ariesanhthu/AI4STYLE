import { IUnitOfWorkSession } from "@/application/shared/interfaces/unit-of-work.interface";
import { CategoryRepository } from "@/infrastructure/category/repositories";
import { OrderRepository } from "@/infrastructure/order/repositories";
import { PaymentMethodRepository } from "@/infrastructure/payment-method/repositories";
import { PaymentRepository } from "@/infrastructure/payment/repositories";
import { ProductRepository } from "@/infrastructure/product/repositories/product.repository";
import { RoleRepository } from "@/infrastructure/role/repositories/role.repository";
import { ImageRepository } from "@/infrastructure/upload/repositories/image.repository";
import { UserRepository } from "@/infrastructure/user/repositories";
import { PrismaService } from "../prisma.service";

export class PrismaUnitOfWorkSession implements IUnitOfWorkSession {
  categoryRepository: CategoryRepository;
  orderRepository: OrderRepository;
  paymentRepository: PaymentRepository;
  paymentMethodRepository: PaymentMethodRepository;
  productRepository: ProductRepository;
  roleRepository: RoleRepository;
  imageRepository: ImageRepository;
  userRepository: UserRepository;

  private onCommit: () => Promise<void>;
  private onRollback: () => Promise<void>;

  constructor(
    private tx: PrismaService,
    onCommit: () => Promise<void>,
    onRollback: () => Promise<void>,
  ) {
    this.categoryRepository = new CategoryRepository(tx);
    this.imageRepository = new ImageRepository(tx);
    this.orderRepository = new OrderRepository(tx);
    this.paymentRepository = new PaymentRepository(tx);
    this.paymentMethodRepository = new PaymentMethodRepository(tx);
    this.productRepository = new ProductRepository(tx);
    this.userRepository = new UserRepository(tx);
    this.roleRepository = new RoleRepository(tx);

    this.onCommit = onCommit;
    this.onRollback = onRollback;
  }

  commit() {
    return this.onCommit();
  }

  rollback() {
    return this.onRollback();
  }

  async end() {
    try {
      await this.onRollback();
    } catch {
      // Ignore error if already committed/rolled back or if rollback fails
    }
  }
}
