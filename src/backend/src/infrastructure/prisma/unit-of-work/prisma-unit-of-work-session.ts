import { IUnitOfWorkSession } from "@/application/shared/interfaces/unit-of-work.interface";
import { PrismaService } from "../prisma.service";
import { PrismaCategoryRepository, PrismaImageRepository, PrismaOrderRepository, PrismaPaymentMethodRepository, PrismaPaymentRepository, PrismaProductRepository, PrismaRoleRepository, PrismaUserRepository } from "../repositories";

export class PrismaUnitOfWorkSession implements IUnitOfWorkSession {
  categoryRepository: PrismaCategoryRepository;
  orderRepository: PrismaOrderRepository;
  paymentRepository: PrismaPaymentRepository;
  paymentMethodRepository: PrismaPaymentMethodRepository;
  productRepository: PrismaProductRepository;
  roleRepository: PrismaRoleRepository;
  imageRepository: PrismaImageRepository;
  userRepository: PrismaUserRepository;

  private onCommit: () => Promise<void>;
  private onRollback: () => Promise<void>;

  constructor(
    private tx: PrismaService,
    onCommit: () => Promise<void>,
    onRollback: () => Promise<void>,
  ) {
    this.categoryRepository = new PrismaCategoryRepository(tx);
    this.imageRepository = new PrismaImageRepository(tx);
    this.orderRepository = new PrismaOrderRepository(tx);
    this.paymentRepository = new PrismaPaymentRepository(tx);
    this.paymentMethodRepository = new PrismaPaymentMethodRepository(tx);
    this.productRepository = new PrismaProductRepository(tx);
    this.userRepository = new PrismaUserRepository(tx);
    this.roleRepository = new PrismaRoleRepository(tx);

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
