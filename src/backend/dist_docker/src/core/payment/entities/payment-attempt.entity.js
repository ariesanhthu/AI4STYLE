"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentAttemptEntity = void 0;
const enums_1 = require("../enums");
class PaymentAttemptEntity {
    paymentAttemptId;
    paymentId;
    paymentMethodId;
    type;
    orderNumber;
    status;
    createdAt;
    updatedAt;
    transactions;
    constructor(paymentAttemptId, paymentId, paymentMethodId, type, orderNumber, status, createdAt, updatedAt, transactions) {
        this.paymentAttemptId = paymentAttemptId;
        this.paymentId = paymentId;
        this.paymentMethodId = paymentMethodId;
        this.type = type;
        this.orderNumber = orderNumber;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.transactions = transactions;
    }
    canBeRetried() {
        return this.status === enums_1.EPaymentStatus.PENDING;
    }
    isFinalState() {
        return [
            enums_1.EPaymentStatus.CAPTURED,
            enums_1.EPaymentStatus.REFUNDED,
            enums_1.EPaymentStatus.CANCELED,
        ].includes(this.status);
    }
    cancel() {
        if (this.status === enums_1.EPaymentStatus.PENDING) {
            this.status = enums_1.EPaymentStatus.CANCELED;
            this.updatedAt = new Date();
        }
    }
    toJSON() {
        return {
            paymentAttemptId: this.paymentAttemptId,
            paymentId: this.paymentId,
            paymentMethodId: this.paymentMethodId,
            type: this.type,
            orderNumber: this.orderNumber,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            transactions: this.transactions?.map((transaction) => transaction.toJSON()),
        };
    }
}
exports.PaymentAttemptEntity = PaymentAttemptEntity;
//# sourceMappingURL=payment-attempt.entity.js.map