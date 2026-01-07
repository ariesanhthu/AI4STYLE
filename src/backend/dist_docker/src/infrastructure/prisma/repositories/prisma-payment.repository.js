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
var PrismaPaymentRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPaymentRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const entities_1 = require("../../../core/payment/entities");
let PrismaPaymentRepository = PrismaPaymentRepository_1 = class PrismaPaymentRepository {
    prisma;
    logger = new common_1.Logger(PrismaPaymentRepository_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createWithAttempt(paymentData, attemptData) {
        const created = await this.prisma.payment.create({
            data: {
                payment_id: paymentData.paymentId,
                order_id: paymentData.orderId,
                payment_method_id: paymentData.paymentMethodId,
                amount: paymentData.amount,
                type: paymentData.type,
                status: paymentData.status,
                created_at: paymentData.createdAt,
                updated_at: paymentData.updatedAt,
            },
            include: {
                attempts: {
                    include: {
                        transactions: {
                            orderBy: {
                                created_at: 'asc',
                            },
                        },
                    },
                    orderBy: {
                        order_number: 'desc',
                    },
                },
            },
        });
        return this.toPaymentEntity(created);
    }
    async createAttempt(attemptData) {
        const created = await this.prisma.paymentAttempt.create({
            data: {
                payment_attempt_id: attemptData.paymentAttemptId,
                payment_id: attemptData.paymentId,
                payment_method_id: attemptData.paymentMethodId,
                type: attemptData.type,
                order_number: attemptData.orderNumber,
                status: attemptData.status,
                created_at: attemptData.createdAt,
                updated_at: attemptData.updatedAt,
            },
            include: {
                transactions: {
                    orderBy: {
                        created_at: 'asc',
                    },
                },
            },
        });
        return this.toAttemptEntity(created);
    }
    async updateAttempt(attemptData) {
        const updated = await this.prisma.paymentAttempt.update({
            where: { payment_attempt_id: attemptData.paymentAttemptId },
            data: {
                payment_method_id: attemptData.paymentMethodId,
                type: attemptData.type,
                status: attemptData.status,
                updated_at: attemptData.updatedAt,
            },
            include: {
                transactions: {
                    orderBy: {
                        created_at: 'asc',
                    },
                },
            },
        });
        return this.toAttemptEntity(updated);
    }
    async createTransaction(transactionData) {
        const created = await this.prisma.paymentTransaction.create({
            data: {
                transaction_id: transactionData.transactionId,
                payment_attempt_id: transactionData.paymentAttemptId,
                request_body: transactionData.requestBody,
                response_body: transactionData.responseBody,
                type: transactionData.type,
                created_at: transactionData.createdAt,
                updated_at: transactionData.updatedAt,
            },
        });
        return this.toTransactionEntity(created);
    }
    async update(updateData) {
        const updated = await this.prisma.payment.update({
            where: { payment_id: updateData.paymentId },
            data: {
                payment_method_id: updateData.paymentMethodId,
                type: updateData.type,
                status: updateData.status,
                updated_at: updateData.updatedAt,
            },
            include: {
                attempts: {
                    include: {
                        transactions: {
                            orderBy: {
                                created_at: 'asc',
                            },
                        },
                    },
                    orderBy: {
                        order_number: 'desc',
                    },
                },
            },
        });
        return this.toPaymentEntity(updated);
    }
    async findById(paymentId) {
        const payment = await this.prisma.payment.findUnique({
            where: { payment_id: paymentId },
            include: {
                attempts: {
                    include: {
                        transactions: {
                            orderBy: {
                                created_at: 'asc',
                            },
                        },
                    },
                    orderBy: {
                        order_number: 'desc',
                    },
                },
            },
        });
        if (!payment)
            return null;
        return this.toPaymentEntity(payment);
    }
    async findByOrderId(orderId) {
        const payment = await this.prisma.payment.findUnique({
            where: { order_id: orderId },
            include: {
                attempts: {
                    include: {
                        transactions: {
                            orderBy: {
                                created_at: 'asc',
                            },
                        },
                    },
                    orderBy: {
                        order_number: 'desc',
                    },
                },
            },
        });
        if (!payment)
            return null;
        return this.toPaymentEntity(payment);
    }
    async findByAttemptId(attemptId) {
        const attempt = await this.prisma.paymentAttempt.findUnique({
            where: { payment_attempt_id: attemptId },
            include: {
                payment: {
                    include: {
                        attempts: {
                            include: {
                                transactions: {
                                    orderBy: {
                                        created_at: 'asc',
                                    },
                                },
                            },
                            orderBy: {
                                order_number: 'desc',
                            },
                        },
                    },
                },
            },
        });
        if (!attempt || !attempt.payment)
            return null;
        return this.toPaymentEntity(attempt.payment);
    }
    async findAll(query) {
        const whereClause = {};
        if (query.status) {
            whereClause.status = query.status;
        }
        if (query.type) {
            whereClause.type = query.type;
        }
        if (query.startDate || query.endDate) {
            whereClause.created_at = {};
            if (query.startDate) {
                whereClause.created_at.gte = new Date(query.startDate);
            }
            if (query.endDate) {
                whereClause.created_at.lte = new Date(query.endDate);
            }
        }
        const payments = await this.prisma.payment.findMany({
            take: query.limit,
            skip: query.cursor ? 1 : 0,
            cursor: query.cursor ? { payment_id: query.cursor } : undefined,
            where: whereClause,
            orderBy: { created_at: query.sortOrder || 'desc' },
            include: {
                attempts: {
                    include: {
                        transactions: {
                            orderBy: {
                                created_at: 'asc',
                            },
                        },
                    },
                    orderBy: {
                        order_number: 'desc',
                    },
                },
            },
        });
        return payments.map((payment) => this.toPaymentEntity(payment));
    }
    toPaymentEntity(payment) {
        return new entities_1.PaymentEntity(payment.payment_id, payment.order_id, payment.payment_method_id, payment.amount, payment.type, payment.status, payment.created_at, payment.updated_at, payment.attempts?.map((a) => this.toAttemptEntity(a)));
    }
    toAttemptEntity(attempt) {
        return new entities_1.PaymentAttemptEntity(attempt.payment_attempt_id, attempt.payment_id, attempt.payment_method_id, attempt.type, attempt.order_number, attempt.status, attempt.created_at, attempt.updated_at, attempt.transactions?.map((t) => this.toTransactionEntity(t)));
    }
    toTransactionEntity(transaction) {
        return new entities_1.PaymentTransactionEntity(transaction.transaction_id, transaction.payment_attempt_id, transaction.request_body, transaction.response_body, transaction.type, transaction.created_at, transaction.updated_at);
    }
};
exports.PrismaPaymentRepository = PrismaPaymentRepository;
exports.PrismaPaymentRepository = PrismaPaymentRepository = PrismaPaymentRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaPaymentRepository);
//# sourceMappingURL=prisma-payment.repository.js.map