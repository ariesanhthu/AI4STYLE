"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentEntity = void 0;
const enums_1 = require("../enums");
class PaymentEntity {
    paymentId;
    orderId;
    paymentMethodId;
    amount;
    type;
    status;
    createdAt;
    updatedAt;
    attempts;
    constructor(paymentId, orderId, paymentMethodId, amount, type, status, createdAt, updatedAt, attempts) {
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.paymentMethodId = paymentMethodId;
        this.amount = amount;
        this.type = type;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.attempts = attempts;
    }
    getLatestAttempt() {
        if (!this.attempts || this.attempts.length === 0) {
            return undefined;
        }
        return this.attempts.reduce((latest, current) => current.orderNumber > latest.orderNumber ? current : latest);
    }
    canCreateNewAttempt() {
        return this.status === enums_1.EPaymentStatus.PENDING;
    }
    syncStatusFromLatestAttempt() {
        const latestAttempt = this.getLatestAttempt();
        if (latestAttempt) {
            if (latestAttempt.status === enums_1.EPaymentStatus.FAILED) {
                this.status = enums_1.EPaymentStatus.PENDING;
            }
            else {
                this.status = latestAttempt.status;
            }
            this.updatedAt = new Date();
        }
    }
    cancelLastPendingAttempt() {
        const latestAttempt = this.getLatestAttempt();
        if (latestAttempt?.canBeRetried()) {
            latestAttempt.cancel();
        }
    }
    getNextAttemptOrderNumber() {
        if (!this.attempts || this.attempts.length === 0) {
            return 1;
        }
        const maxOrder = Math.max(...this.attempts.map((a) => a.orderNumber));
        return maxOrder + 1;
    }
    getAttemptById(attemptId) {
        return this.attempts?.find((attempt) => attempt.paymentAttemptId === attemptId);
    }
    getValueInTransactionPayload(key, type) {
        for (const attempt of this.attempts || []) {
            for (const transaction of attempt.transactions || []) {
                if (transaction.type === type) {
                    try {
                        const jsonRequest = JSON.parse(transaction.requestBody);
                        const jsonResponse = JSON.parse(transaction.responseBody);
                        if (key in jsonRequest) {
                            return jsonRequest[key];
                        }
                        if (key in jsonResponse) {
                            return jsonResponse[key];
                        }
                    }
                    catch (error) {
                    }
                }
            }
        }
        return undefined;
    }
    toJSON() {
        return {
            paymentId: this.paymentId,
            orderId: this.orderId,
            paymentMethodId: this.paymentMethodId,
            amount: this.amount,
            type: this.type,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            attempts: this.attempts?.map((attempt) => attempt.toJSON()),
        };
    }
}
exports.PaymentEntity = PaymentEntity;
//# sourceMappingURL=payment.entity.js.map