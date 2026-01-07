"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodService = void 0;
const entities_1 = require("../../../core/payment-method/entities");
const enums_1 = require("../../../core/payment-method/enums");
const crypto_1 = require("crypto");
const exceptions_1 = require("../../../core/payment-method/exceptions");
class PaymentMethodService {
    paymentMethodRepository;
    logger;
    constructor(paymentMethodRepository, logger) {
        this.paymentMethodRepository = paymentMethodRepository;
        this.logger = logger;
        this.logger.setContext(PaymentMethodService.name);
    }
    async getPaymentMethodById(id) {
        try {
            const paymentMethod = await this.paymentMethodRepository.findById(id);
            if (!paymentMethod) {
                throw new exceptions_1.PaymentMethodNotFoundException(id);
            }
            return paymentMethod.toJSON();
        }
        catch (error) {
            this.logger.error(`Failed to get payment method by id ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getAllPaymentMethods() {
        try {
            const paymentMethods = await this.paymentMethodRepository.findAll();
            return paymentMethods.map((pm) => pm.toJSON());
        }
        catch (error) {
            this.logger.error(`Failed to get all payment methods: ${error.message}`, error.stack);
            throw error;
        }
    }
    async initializeDefaultPaymentMethods() {
        try {
            const existingMethods = await this.paymentMethodRepository.findAll();
            if (existingMethods.length === 0) {
                this.logger.log('Initializing default payment methods...');
                const codMethod = new entities_1.PaymentMethodEntity((0, crypto_1.randomUUID)(), 'Cash on Delivery', enums_1.EPaymentMethod.CASH_ON_DELIVERY, '💵', 'Pay with cash when your order is delivered', new Date(), new Date());
                const momoMethod = new entities_1.PaymentMethodEntity((0, crypto_1.randomUUID)(), 'MoMo E-Wallet', enums_1.EPaymentMethod.MOMO, '🟣', 'Pay with MoMo electronic wallet', new Date(), new Date());
                await this.paymentMethodRepository.create(codMethod);
                await this.paymentMethodRepository.create(momoMethod);
                this.logger.log('Default payment methods created successfully');
            }
            else {
                this.logger.log(`Found ${existingMethods.length} existing payment methods`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to initialize payment methods: ${error.message}`, error.stack);
        }
    }
}
exports.PaymentMethodService = PaymentMethodService;
//# sourceMappingURL=payment-method.service.js.map