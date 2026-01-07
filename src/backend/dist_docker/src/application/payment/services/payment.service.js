"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const crypto_1 = require("crypto");
const entities_1 = require("../../../core/payment/entities");
const enums_1 = require("../../../core/payment-method/enums");
const enums_2 = require("../../../core/order/enums");
const enums_3 = require("../../../core/payment/enums");
const exceptions_1 = require("../../../core/payment/exceptions");
const enums_4 = require("../../../shared/enums");
class PaymentService {
    providerDiscoveryService;
    paymentRepository;
    logger;
    unitOfWork;
    constructor(providerDiscoveryService, paymentRepository, logger, unitOfWork) {
        this.providerDiscoveryService = providerDiscoveryService;
        this.paymentRepository = paymentRepository;
        this.logger = logger;
        this.unitOfWork = unitOfWork;
        this.logger.setContext(PaymentService.name);
    }
    async createPayment(body) {
        const session = await this.unitOfWork.start();
        try {
            const paymentMethod = await session.paymentMethodRepository.findById(body.paymentMethodId);
            if (!paymentMethod) {
                throw new exceptions_1.InvalidPaymentMethodException('Invalid payment method ID');
            }
            const order = await session.orderRepository.findById(body.orderId);
            if (!order) {
                throw new exceptions_1.OrderNotFoundException(body.orderId);
            }
            let existingPayment = await session.paymentRepository.findByOrderId(body.orderId);
            if (existingPayment) {
                if (!existingPayment.canCreateNewAttempt()) {
                    throw new exceptions_1.InvalidPaymentStatusException(`Cannot create new payment attempt. Payment status is ${existingPayment.status}. Only PENDING payments can have new attempts.`);
                }
                existingPayment.cancelLastPendingAttempt();
                const lastAttempt = existingPayment.getLatestAttempt();
                if (lastAttempt && lastAttempt.status === enums_3.EPaymentStatus.CANCELED) {
                    await session.paymentRepository.updateAttempt(lastAttempt);
                }
                const nextOrderNumber = existingPayment.getNextAttemptOrderNumber();
                const provider = this.providerDiscoveryService.getProvider(paymentMethod.type);
                if (!provider || !provider.create) {
                    throw new exceptions_1.PaymentProviderNotFoundException(paymentMethod.type);
                }
                const paymentResponse = await provider.create(existingPayment.paymentId, nextOrderNumber, paymentMethod, order.totalPrice, session);
                existingPayment.type = paymentMethod.type;
                existingPayment.paymentMethodId = paymentMethod.paymentMethodId;
                existingPayment.updatedAt = new Date();
                await session.paymentRepository.update(existingPayment);
                if (paymentMethod.type === enums_1.EPaymentMethod.CASH_ON_DELIVERY) {
                    order.status = enums_2.EOrderStatus.PENDING;
                    await session.orderRepository.update(order.orderId, order);
                }
                await session.commit();
                return paymentResponse;
            }
            else {
                const newPayment = new entities_1.PaymentEntity((0, crypto_1.randomUUID)(), body.orderId, paymentMethod.paymentMethodId, order.totalPrice, paymentMethod.type, enums_3.EPaymentStatus.PENDING, new Date(), new Date());
                const createdPayment = await session.paymentRepository.createWithAttempt(newPayment, null);
                const provider = this.providerDiscoveryService.getProvider(paymentMethod.type);
                if (!provider || !provider.create) {
                    throw new exceptions_1.PaymentProviderNotFoundException(paymentMethod.type);
                }
                const paymentResponse = await provider.create(createdPayment.paymentId, 1, paymentMethod, order.totalPrice, session);
                if (paymentMethod.type === enums_1.EPaymentMethod.CASH_ON_DELIVERY) {
                    order.status = enums_2.EOrderStatus.PENDING;
                    await session.orderRepository.update(order.orderId, order);
                }
                await session.commit();
                return paymentResponse;
            }
        }
        catch (error) {
            await session.rollback();
            this.logger.error(`Error creating payment: ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await session.end();
        }
    }
    async cancelPayment(paymentId) {
        const session = await this.unitOfWork.start();
        try {
            const payment = await session.paymentRepository.findById(paymentId);
            if (!payment) {
                throw new exceptions_1.PaymentNotFoundException(paymentId);
            }
            const provider = this.providerDiscoveryService.getProvider(payment.type);
            if (!provider || !provider.cancel) {
                throw new exceptions_1.PaymentProviderNotFoundException(payment.type);
            }
            const paymentResponse = await provider.cancel(payment, session);
            paymentResponse.status = enums_3.EPaymentStatus.CANCELED;
            await session.paymentRepository.update(paymentResponse);
            await session.commit();
            return paymentResponse;
        }
        catch (error) {
            await session.rollback();
            this.logger.error(`Error canceling payment: ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await session.end();
        }
    }
    async refundPayment(paymentId) {
        const session = await this.unitOfWork.start();
        try {
            const payment = await session.paymentRepository.findById(paymentId);
            if (!payment) {
                throw new exceptions_1.PaymentNotFoundException(paymentId);
            }
            if (payment.status !== enums_3.EPaymentStatus.CAPTURED) {
                throw new exceptions_1.InvalidPaymentStatusException('Only CAPTURED payments can be refunded');
            }
            const provider = this.providerDiscoveryService.getProvider(payment.type);
            if (!provider || !provider.refund) {
                throw new exceptions_1.PaymentProviderNotFoundException(payment.type);
            }
            const paymentResponse = await provider.refund(payment, session);
            paymentResponse.status = enums_3.EPaymentStatus.REFUNDED;
            await session.paymentRepository.update(paymentResponse);
            await session.commit();
            return paymentResponse;
        }
        catch (error) {
            await session.rollback();
            this.logger.error(`Error refunding payment: ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await session.end();
        }
    }
    async capturePayment(paymentId) {
        const session = await this.unitOfWork.start();
        try {
            const payment = await session.paymentRepository.findById(paymentId);
            if (!payment) {
                throw new exceptions_1.PaymentNotFoundException(paymentId);
            }
            const provider = this.providerDiscoveryService.getProvider(payment.type);
            if (!provider || !provider.capture) {
                throw new exceptions_1.PaymentProviderNotFoundException(payment.type);
            }
            const paymentResponse = await provider.capture(payment, session);
            paymentResponse.status = enums_3.EPaymentStatus.CAPTURED;
            await session.paymentRepository.update(paymentResponse);
            await session.commit();
            return paymentResponse;
        }
        catch (error) {
            await session.rollback();
            this.logger.error(`Error capturing payment: ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await session.end();
        }
    }
    async handleProviderWebhook(type, payload) {
        const session = await this.unitOfWork.start();
        try {
            const provider = this.providerDiscoveryService.getProvider(type);
            if (!provider || !provider.handleIPN) {
                throw new exceptions_1.PaymentProviderNotFoundException(type);
            }
            const { response, payment } = await provider.handleIPN(payload, session);
            await session.commit();
            return response;
        }
        catch (error) {
            await session.rollback();
            this.logger.error(`Error handling provider webhook: ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await session.end();
        }
    }
    async getPaymentById(paymentId) {
        try {
            const payment = await this.paymentRepository.findById(paymentId);
            if (!payment) {
                throw new exceptions_1.PaymentNotFoundException(paymentId);
            }
            return payment.toJSON();
        }
        catch (error) {
            this.logger.error(`Error getting payment by id: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getListOfPayments(query) {
        try {
            if (!query.limit)
                query.limit = 10;
            if (!query.sortOrder)
                query.sortOrder = enums_4.ESortOrder.DESC;
            query.limit += 1;
            const payments = await this.paymentRepository.findAll(query);
            let nextCursor = null;
            if (payments.length > query.limit) {
                const nextItem = payments.pop();
                nextCursor = nextItem?.paymentId || null;
            }
            return {
                items: payments.map((payment) => payment.toJSON()),
                nextCursor,
            };
        }
        catch (error) {
            this.logger.error(`Error retrieving list of payments: ${error.message}`, error.stack);
            throw error;
        }
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map