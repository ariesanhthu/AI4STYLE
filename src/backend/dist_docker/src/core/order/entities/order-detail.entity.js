"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDetailEntity = void 0;
class OrderDetailEntity {
    orderDetailId;
    orderId;
    variantId;
    quantity;
    pricePerUnit;
    createdAt;
    updatedAt;
    variant;
    constructor(orderDetailId, orderId, variantId, quantity, pricePerUnit, createdAt, updatedAt, variant) {
        this.orderDetailId = orderDetailId;
        this.orderId = orderId;
        this.variantId = variantId;
        this.quantity = quantity;
        this.pricePerUnit = pricePerUnit;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.variant = variant;
    }
    toJSON() {
        return {
            orderDetailId: this.orderDetailId,
            orderId: this.orderId,
            variantId: this.variantId,
            quantity: this.quantity,
            pricePerUnit: this.pricePerUnit,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            variant: this.variant?.toJSON() || null,
        };
    }
}
exports.OrderDetailEntity = OrderDetailEntity;
//# sourceMappingURL=order-detail.entity.js.map