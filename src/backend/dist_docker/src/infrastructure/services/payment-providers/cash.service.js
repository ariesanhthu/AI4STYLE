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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashService = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../../core/payment/entities");
const enums_1 = require("../../../core/payment-method/enums");
const crypto_1 = require("crypto");
const enums_2 = require("../../../core/payment/enums");
const interfaces_1 = require("../../../core/payment/interfaces");
let CashService = class CashService {
    paymentRepository;
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    type = enums_1.EPaymentMethod.CASH_ON_DELIVERY;
    async create(paymentId, orderNumber, paymentMethod, amount, session) {
        const attempt = new entities_1.PaymentAttemptEntity((0, crypto_1.randomUUID)(), paymentId, paymentMethod.paymentMethodId, this.type, orderNumber, enums_2.EPaymentStatus.PENDING, new Date(), new Date());
        await session.paymentRepository.createAttempt(attempt);
        return { payUrl: null };
    }
    async capture(payment, session) {
        const latestAttempt = payment.getLatestAttempt();
        if (!latestAttempt) {
            throw new Error('No payment attempt found to capture');
        }
        latestAttempt.status = enums_2.EPaymentStatus.CAPTURED;
        latestAttempt.updatedAt = new Date();
        await session.paymentRepository.updateAttempt(latestAttempt);
        payment.syncStatusFromLatestAttempt();
        const updatedPayment = await session.paymentRepository.update(payment);
        return updatedPayment;
    }
    async refund(payment, session) {
        const latestAttempt = payment.getLatestAttempt();
        if (!latestAttempt) {
            throw new Error('No payment attempt found to refund');
        }
        latestAttempt.status = enums_2.EPaymentStatus.REFUNDED;
        latestAttempt.updatedAt = new Date();
        await session.paymentRepository.updateAttempt(latestAttempt);
        payment.syncStatusFromLatestAttempt();
        const updatedPayment = await session.paymentRepository.update(payment);
        return updatedPayment;
    }
    async cancel(payment, session) {
        const latestAttempt = payment.getLatestAttempt();
        if (!latestAttempt) {
            throw new Error('No payment attempt found to cancel');
        }
        latestAttempt.status = enums_2.EPaymentStatus.CANCELED;
        latestAttempt.updatedAt = new Date();
        await session.paymentRepository.updateAttempt(latestAttempt);
        payment.syncStatusFromLatestAttempt();
        const updatedPayment = await session.paymentRepository.update(payment);
        return updatedPayment;
    }
};
exports.CashService = CashService;
exports.CashService = CashService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(interfaces_1.PAYMENT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CashService);
//# sourceMappingURL=cash.service.js.map