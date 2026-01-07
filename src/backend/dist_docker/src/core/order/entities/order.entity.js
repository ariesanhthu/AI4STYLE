"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderEntity = void 0;
class OrderEntity {
    orderId;
    userId;
    orderCode;
    totalPrice;
    status;
    recipientName;
    phoneNumber;
    shippingAddress;
    email;
    search;
    createdAt;
    updatedAt;
    orderDetails;
    constructor(orderId, userId, orderCode, totalPrice, status, recipientName, phoneNumber, shippingAddress, email, search, createdAt, updatedAt, orderDetails) {
        this.orderId = orderId;
        this.userId = userId;
        this.orderCode = orderCode;
        this.totalPrice = totalPrice;
        this.status = status;
        this.recipientName = recipientName;
        this.phoneNumber = phoneNumber;
        this.shippingAddress = shippingAddress;
        this.email = email;
        this.search = search;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.orderDetails = orderDetails;
    }
    toJSON() {
        return {
            orderId: this.orderId,
            userId: this.userId,
            orderCode: this.orderCode,
            totalPrice: this.totalPrice,
            status: this.status,
            recipientName: this.recipientName,
            phoneNumber: this.phoneNumber,
            shippingAddress: this.shippingAddress,
            email: this.email,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            orderDetails: this.orderDetails?.map((detail) => detail.toJSON()),
        };
    }
}
exports.OrderEntity = OrderEntity;
//# sourceMappingURL=order.entity.js.map