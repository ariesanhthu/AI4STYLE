"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentTransactionEntity = void 0;
class PaymentTransactionEntity {
    transactionId;
    paymentAttemptId;
    requestBody;
    responseBody;
    type;
    createdAt;
    updatedAt;
    constructor(transactionId, paymentAttemptId, requestBody, responseBody, type, createdAt, updatedAt) {
        this.transactionId = transactionId;
        this.paymentAttemptId = paymentAttemptId;
        this.requestBody = requestBody;
        this.responseBody = responseBody;
        this.type = type;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    toJSON() {
        return {
            transactionId: this.transactionId,
            paymentAttemptId: this.paymentAttemptId,
            requestBody: JSON.parse(this.requestBody),
            responseBody: JSON.parse(this.responseBody),
            type: this.type,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
exports.PaymentTransactionEntity = PaymentTransactionEntity;
//# sourceMappingURL=payment-transaction.entity.js.map