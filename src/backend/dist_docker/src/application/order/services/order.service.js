"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const helpers_1 = require("../../../shared/helpers");
const crypto_1 = require("crypto");
const entities_1 = require("../../../core/order/entities");
const enums_1 = require("../../../core/order/enums");
const exceptions_1 = require("../../../core/order/exceptions");
const enums_2 = require("../../../shared/enums");
class OrderService {
    orderRepository;
    logger;
    unitOfWork;
    constructor(orderRepository, logger, unitOfWork) {
        this.orderRepository = orderRepository;
        this.logger = logger;
        this.unitOfWork = unitOfWork;
        this.logger.setContext(OrderService.name);
    }
    async getById(orderId) {
        try {
            const order = await this.orderRepository.findWithDetails(orderId, undefined);
            if (!order) {
                throw new exceptions_1.OrderNotFoundException(orderId);
            }
            return order;
        }
        catch (error) {
            this.logger.error(`Failed to get order by id ${orderId}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getByCode(orderCode) {
        try {
            const order = await this.orderRepository.findWithDetails(undefined, orderCode);
            if (!order) {
                throw new exceptions_1.OrderNotFoundException(orderCode);
            }
            return order;
        }
        catch (error) {
            this.logger.error(`Failed to get order by code ${orderCode}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getListOfOrders(query) {
        try {
            if (query.search) {
                query.search = (0, helpers_1.buildSearchString)(query.search);
            }
            if (!query.limit)
                query.limit = 10;
            if (!query.sortOrder)
                query.sortOrder = enums_2.ESortOrder.DESC;
            query.limit += 1;
            const orders = await this.orderRepository.findAll(query);
            const nextCursor = orders.length === query.limit
                ? orders[orders.length - 1].orderId
                : null;
            if (nextCursor) {
                orders.pop();
            }
            return {
                items: orders.map((order) => order.toJSON()),
                nextCursor,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get list of orders: ${error.message}`, error.stack);
            throw error;
        }
    }
    async createOrder(userId, orderData) {
        const session = await this.unitOfWork.start();
        try {
            const variantIds = orderData.orderDetails.map((detail) => detail.variantId);
            const variants = await session.productRepository.findProductVariantByIds(variantIds);
            if (!variants || variants.length !== variantIds.length) {
                throw new exceptions_1.OrderCreationFailedException('Some product variants not found');
            }
            let totalPrice = 0;
            const stockUpdates = [];
            const enhancedDetails = [];
            for (const detail of orderData.orderDetails) {
                const variant = variants.find((v) => v.variantId === detail.variantId);
                if (!variant) {
                    throw new exceptions_1.OrderCreationFailedException(`Variant ${detail.variantId} not found`);
                }
                if (variant.stockQuantity < detail.quantity) {
                    throw new exceptions_1.OrderCreationFailedException(`Insufficient stock for variant ${detail.variantId}. Available: ${variant.stockQuantity}, Requested: ${detail.quantity}`);
                }
                totalPrice += (variant.newPrice ?? variant.price) * detail.quantity;
                stockUpdates.push({
                    variantId: detail.variantId,
                    stockQuantity: variant.stockQuantity - detail.quantity,
                });
                enhancedDetails.push({
                    ...detail,
                    pricePerUnit: variant.newPrice ?? variant.price,
                });
            }
            await session.productRepository.updateBulkProductVariants(stockUpdates);
            const orderCode = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            const orderDetails = enhancedDetails.map((detail) => new entities_1.OrderDetailEntity((0, crypto_1.randomUUID)(), '', detail.variantId, detail.quantity, detail.pricePerUnit, new Date(), new Date()));
            const orderEntity = new entities_1.OrderEntity((0, crypto_1.randomUUID)(), userId, orderCode, totalPrice, enums_1.EOrderStatus.PENDING_PAYMENT, orderData.recipientName, orderData.phoneNumber, orderData.shippingAddress, orderData.email || null, (0, helpers_1.buildSearchString)(orderCode, orderData.email ?? '', orderData.phoneNumber, orderData.shippingAddress), new Date(), new Date(), orderDetails);
            const createdOrder = await session.orderRepository.create(orderEntity);
            this.logger.log(`Order created: ${createdOrder.orderId}`);
            await session.commit();
            return createdOrder.toJSON();
        }
        catch (error) {
            await session.rollback();
            this.logger.error(`Failed to create order: ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await session.end();
        }
    }
    async updateOrderStatus(orderId, body) {
        try {
            const order = await this.orderRepository.findById(orderId);
            if (!order) {
                throw new exceptions_1.OrderNotFoundException(orderId);
            }
            const { status } = body;
            if (status === enums_1.EOrderStatus.CANCELED) {
                return this.cancelOrder(orderId);
            }
            this.validateStatusTransition(order.status, status);
            order.status = status;
            order.updatedAt = new Date();
            const updatedOrder = await this.orderRepository.update(orderId, order);
            this.logger.log(`Order status updated: ${orderId} -> ${status}`);
            return updatedOrder.toJSON();
        }
        catch (error) {
            this.logger.error(`Failed to update order status: ${error.message}`, error.stack);
            throw error;
        }
    }
    async cancelOrder(orderId) {
        const session = await this.unitOfWork.start();
        try {
            const order = await session.orderRepository.findById(orderId);
            if (!order) {
                throw new exceptions_1.OrderNotFoundException(orderId);
            }
            if (order.status === enums_1.EOrderStatus.DELIVERED ||
                order.status === enums_1.EOrderStatus.CANCELED) {
                throw new exceptions_1.OrderCancellationFailedException(`Order with status ${order.status} cannot be canceled`);
            }
            if (order.orderDetails && order.orderDetails.length > 0) {
                const variantIds = order.orderDetails.map((detail) => detail.variantId);
                const variants = await session.productRepository.findProductVariantByIds(variantIds);
                if (!variants || variants.length !== variantIds.length) {
                    throw new exceptions_1.OrderCancellationFailedException('Some product variants not found');
                }
                const stockUpdates = order.orderDetails.map((detail) => ({
                    variantId: detail.variantId,
                    stockQuantity: detail.quantity + variants.find((variant) => variant.variantId === detail.variantId)?.stockQuantity,
                }));
                await session.productRepository.updateBulkProductVariants(stockUpdates);
            }
            order.status = enums_1.EOrderStatus.CANCELED;
            order.updatedAt = new Date();
            const canceledOrder = await session.orderRepository.update(orderId, order);
            this.logger.log(`Order canceled: ${orderId}`);
            await session.commit();
            return canceledOrder.toJSON();
        }
        catch (error) {
            await session.rollback();
            this.logger.error(`Failed to cancel order: ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await session.end();
        }
    }
    async deleteOrder(orderId) {
        try {
            const order = await this.orderRepository.findById(orderId);
            if (!order) {
                throw new exceptions_1.OrderNotFoundException(orderId);
            }
            if (order.status !== enums_1.EOrderStatus.CANCELED) {
                throw new exceptions_1.InvalidOrderStatusException('Only canceled orders can be deleted');
            }
            await this.orderRepository.delete(orderId);
            this.logger.log(`Order deleted: ${orderId}`);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to delete order: ${error.message}`, error.stack);
            throw error;
        }
    }
    validateStatusTransition(currentStatus, newStatus) {
        const validTransitions = {
            [enums_1.EOrderStatus.PENDING_PAYMENT]: [
                enums_1.EOrderStatus.PENDING,
                enums_1.EOrderStatus.CANCELED,
            ],
            [enums_1.EOrderStatus.PENDING]: [enums_1.EOrderStatus.PROCESSING, enums_1.EOrderStatus.CANCELED],
            [enums_1.EOrderStatus.PROCESSING]: [enums_1.EOrderStatus.SHIPPING, enums_1.EOrderStatus.CANCELED],
            [enums_1.EOrderStatus.SHIPPING]: [enums_1.EOrderStatus.DELIVERED, enums_1.EOrderStatus.RETURNED],
            [enums_1.EOrderStatus.DELIVERED]: [enums_1.EOrderStatus.RETURNED],
            [enums_1.EOrderStatus.CANCELED]: [],
            [enums_1.EOrderStatus.RETURNED]: [],
        };
        const allowedStatuses = validTransitions[currentStatus];
        if (!allowedStatuses.includes(newStatus)) {
            throw new exceptions_1.InvalidOrderStatusException(`Invalid status transition from ${currentStatus} to ${newStatus}`);
        }
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map