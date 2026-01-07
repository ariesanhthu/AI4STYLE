"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodEntity = void 0;
class PaymentMethodEntity {
    paymentMethodId;
    displayName;
    type;
    icon;
    description;
    createdAt;
    updatedAt;
    constructor(paymentMethodId, displayName, type, icon, description, createdAt, updatedAt) {
        this.paymentMethodId = paymentMethodId;
        this.displayName = displayName;
        this.type = type;
        this.icon = icon;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    toJSON() {
        return {
            paymentMethodId: this.paymentMethodId,
            displayName: this.displayName,
            type: this.type,
            icon: this.icon,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
exports.PaymentMethodEntity = PaymentMethodEntity;
//# sourceMappingURL=payment-method.entity.js.map