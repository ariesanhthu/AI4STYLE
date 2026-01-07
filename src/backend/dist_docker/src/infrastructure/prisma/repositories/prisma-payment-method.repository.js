"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PrismaPaymentMethodRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPaymentMethodRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const entities_1 = require("../../../core/payment-method/entities");
let PrismaPaymentMethodRepository = PrismaPaymentMethodRepository_1 = class PrismaPaymentMethodRepository {
    prisma;
    logger = new common_1.Logger(PrismaPaymentMethodRepository_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const paymentMethod = await this.prisma.paymentMethod.findUnique({
            where: { payment_method_id: id },
        });
        return paymentMethod ? this.toEntity(paymentMethod) : null;
    }
    async findAll() {
        const paymentMethods = await this.prisma.paymentMethod.findMany({
            orderBy: { created_at: 'asc' },
        });
        return paymentMethods.map((pm) => this.toEntity(pm));
    }
    async create(paymentMethod) {
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
    async update(paymentMethod) {
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
    async delete(id) {
        await this.prisma.paymentMethod.delete({
            where: { payment_method_id: id },
        });
        return true;
    }
    toEntity(raw) {
        return new entities_1.PaymentMethodEntity(raw.payment_method_id, raw.display_name, raw.type, raw.icon, raw.description, raw.created_at, raw.updated_at);
    }
};
exports.PrismaPaymentMethodRepository = PrismaPaymentMethodRepository;
exports.PrismaPaymentMethodRepository = PrismaPaymentMethodRepository = PrismaPaymentMethodRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaPaymentMethodRepository);
//# sourceMappingURL=prisma-payment-method.repository.js.map