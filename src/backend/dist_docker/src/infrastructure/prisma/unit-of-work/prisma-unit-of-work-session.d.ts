import { IUnitOfWorkSession } from "@/application/shared/interfaces/unit-of-work.interface";
import { PrismaService } from "../prisma.service";
import { PrismaCategoryRepository, PrismaImageRepository, PrismaOrderRepository, PrismaPaymentMethodRepository, PrismaPaymentRepository, PrismaProductRepository, PrismaRoleRepository, PrismaUserRepository } from "../repositories";
export declare class PrismaUnitOfWorkSession implements IUnitOfWorkSession {
    private tx;
    categoryRepository: PrismaCategoryRepository;
    orderRepository: PrismaOrderRepository;
    paymentRepository: PrismaPaymentRepository;
    paymentMethodRepository: PrismaPaymentMethodRepository;
    productRepository: PrismaProductRepository;
    roleRepository: PrismaRoleRepository;
    imageRepository: PrismaImageRepository;
    userRepository: PrismaUserRepository;
    private onCommit;
    private onRollback;
    constructor(tx: PrismaService, onCommit: () => Promise<void>, onRollback: () => Promise<void>);
    commit(): Promise<void>;
    rollback(): Promise<void>;
    end(): Promise<void>;
}
