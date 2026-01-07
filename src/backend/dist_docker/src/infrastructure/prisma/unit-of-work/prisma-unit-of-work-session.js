"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUnitOfWorkSession = void 0;
const repositories_1 = require("../repositories");
class PrismaUnitOfWorkSession {
    tx;
    categoryRepository;
    orderRepository;
    paymentRepository;
    paymentMethodRepository;
    productRepository;
    roleRepository;
    imageRepository;
    userRepository;
    onCommit;
    onRollback;
    constructor(tx, onCommit, onRollback) {
        this.tx = tx;
        this.categoryRepository = new repositories_1.PrismaCategoryRepository(tx);
        this.imageRepository = new repositories_1.PrismaImageRepository(tx);
        this.orderRepository = new repositories_1.PrismaOrderRepository(tx);
        this.paymentRepository = new repositories_1.PrismaPaymentRepository(tx);
        this.paymentMethodRepository = new repositories_1.PrismaPaymentMethodRepository(tx);
        this.productRepository = new repositories_1.PrismaProductRepository(tx);
        this.userRepository = new repositories_1.PrismaUserRepository(tx);
        this.roleRepository = new repositories_1.PrismaRoleRepository(tx);
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
        }
        catch {
        }
    }
}
exports.PrismaUnitOfWorkSession = PrismaUnitOfWorkSession;
//# sourceMappingURL=prisma-unit-of-work-session.js.map