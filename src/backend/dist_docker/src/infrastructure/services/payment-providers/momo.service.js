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
var MomoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MomoService = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../../core/payment/entities");
const crypto_1 = require("crypto");
const hash_helper_1 = require("../../../shared/helpers/hash.helper");
const http_service_1 = require("@nestjs/axios/dist/http.service");
const rxjs_1 = require("rxjs");
const enums_1 = require("../../../core/payment/enums");
const interfaces_1 = require("../../../core/payment/interfaces");
const enums_2 = require("../../../core/payment-method/enums");
let MomoService = MomoService_1 = class MomoService {
    httpService;
    paymentRepository;
    constructor(httpService, paymentRepository) {
        this.httpService = httpService;
        this.paymentRepository = paymentRepository;
    }
    logger = new common_1.Logger(MomoService_1.name);
    type = enums_2.EPaymentMethod.MOMO;
    async create(paymentId, orderNumber, paymentMethod, amount, session) {
        try {
            const { accessKey, secretKey, partnerCode, momoUrl } = this.loadMomoConfig();
            const redirectUrl = 'www.example.com/return';
            const ipnUrl = process.env.MOMO_IPN_URL;
            const partnerName = process.env.MOMO_PARTNER_NAME || 'MoMo Payment';
            const storeId = process.env.MOMO_STORE_ID || '';
            const storeName = process.env.MOMO_STORE_NAME || '';
            if (!ipnUrl || !momoUrl) {
                throw new common_1.BadRequestException('Momo payment: IPN URL or MoMo URL not configured!');
            }
            const attemptId = (0, crypto_1.randomUUID)();
            const requestId = (0, crypto_1.randomUUID)();
            const orderInfo = 'pay with MoMo';
            const requestType = 'payWithMethod';
            const orderMomoId = this.generateMomoOrderId(attemptId);
            const extraData = '';
            const lang = 'vi';
            const rawSignature = `accessKey=${accessKey}` +
                `&amount=${amount}` +
                `&extraData=${extraData}` +
                `&ipnUrl=${ipnUrl}` +
                `&orderId=${orderMomoId}` +
                `&orderInfo=${orderInfo}` +
                `&partnerCode=${partnerCode}` +
                `&redirectUrl=${redirectUrl}` +
                `&requestId=${requestId}` +
                `&requestType=${requestType}`;
            const signature = (0, hash_helper_1.hashSHA256)(rawSignature, secretKey);
            const requestBody = {
                partnerCode,
                partnerName,
                storeId,
                storeName,
                requestId,
                amount: amount,
                orderId: orderMomoId,
                redirectUrl,
                ipnUrl,
                lang,
                requestType,
                orderInfo,
                extraData,
                signature,
                autoCapture: false,
            };
            this.logger.debug('Momo Request Body:', requestBody);
            const result = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${momoUrl}/create`, requestBody, {
                headers: { 'Content-Type': 'application/json' },
            }));
            if (result.data.resultCode !== 0) {
                throw new common_1.BadRequestException(`[Code: ${result.data.resultCode}]: ${result.data.message}`);
            }
            const response = result.data;
            const attempt = new entities_1.PaymentAttemptEntity(attemptId, paymentId, paymentMethod.paymentMethodId, enums_2.EPaymentMethod.MOMO, orderNumber, enums_1.EPaymentStatus.PENDING, new Date(), new Date());
            const createdAttempt = await session.paymentRepository.createAttempt(attempt);
            if (!createdAttempt) {
                throw new common_1.BadRequestException('Payment attempt creation failed!');
            }
            await session.paymentRepository.createTransaction(new entities_1.PaymentTransactionEntity((0, crypto_1.randomUUID)(), createdAttempt.paymentAttemptId, JSON.stringify(requestBody), JSON.stringify(response), enums_1.ETransactionType.INITIATED, new Date(), new Date()));
            return {
                payUrl: response.payUrl,
            };
        }
        catch (error) {
            console.error('[Momo Pay Error]', error.response?.data || error.message);
            throw new common_1.BadRequestException(error.response?.data || error.message);
        }
    }
    async capture(payment, session) {
        return payment;
    }
    async refund(payment, session) {
        const lastAttempt = payment.getLatestAttempt();
        if (!lastAttempt) {
            throw new Error('No payment attempt found to cancel');
        }
        if (lastAttempt.type !== enums_2.EPaymentMethod.MOMO) {
            throw new Error('Invalid payment method for cancellation');
        }
        const { accessKey, secretKey, partnerCode, momoUrl } = this.loadMomoConfig();
        const transId = payment.getValueInTransactionPayload('transId', enums_1.ETransactionType.CAPTURED);
        if (!transId) {
            throw new Error('No transId found for captured payment');
        }
        if (Number.isNaN(Number(transId))) {
            throw new Error('Invalid transId found for captured payment');
        }
        const orderId = this.generateMomoOrderId((0, crypto_1.randomUUID)());
        const requestId = (0, crypto_1.randomUUID)();
        const bodyRefund = {
            partnerCode,
            orderId,
            requestId,
            amount: payment.amount,
            transId: Number(transId),
            lang: 'vi',
            description: 'Payment refund',
            signature: '',
        };
        const rawSignatureConfirm = `accessKey=${accessKey}` +
            `&amount=${bodyRefund.amount}` +
            `&description=${bodyRefund.description}` +
            `&orderId=${orderId}` +
            `&partnerCode=${partnerCode}` +
            `&requestId=${requestId}` +
            `&transId=${bodyRefund.transId}`;
        const signatureConfirm = (0, hash_helper_1.hashSHA256)(rawSignatureConfirm, secretKey);
        bodyRefund.signature = signatureConfirm;
        const resultRefund = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${momoUrl}/refund`, {
            ...bodyRefund,
            signature: signatureConfirm,
        }));
        const response = resultRefund.data;
        await session.paymentRepository.createTransaction(new entities_1.PaymentTransactionEntity((0, crypto_1.randomUUID)(), lastAttempt.paymentAttemptId, JSON.stringify(bodyRefund), JSON.stringify(response), enums_1.ETransactionType.REFUNDED, new Date(), new Date()));
        if (response.resultCode !== 0) {
            throw new common_1.BadRequestException(`[Code: ${response.resultCode}]: ${response.message}`);
        }
        lastAttempt.status = enums_1.EPaymentStatus.REFUNDED;
        await session.paymentRepository.updateAttempt(lastAttempt);
        payment.syncStatusFromLatestAttempt();
        const updatedPayment = await session.paymentRepository.update(payment);
        return updatedPayment;
    }
    async cancel(payment, session) {
        const lastAttempt = payment.getLatestAttempt();
        if (!lastAttempt) {
            throw new Error('No payment attempt found to cancel');
        }
        if (lastAttempt.type !== enums_2.EPaymentMethod.MOMO) {
            throw new Error('Invalid payment method for cancellation');
        }
        if (lastAttempt.status !== enums_1.EPaymentStatus.PENDING) {
            throw new Error('Only pending payments can be canceled');
        }
        const { accessKey, secretKey, partnerCode, momoUrl } = this.loadMomoConfig();
        const { requestPayload, responsePayload } = await this.momoConfirm(accessKey, secretKey, partnerCode, this.generateMomoOrderId(lastAttempt.paymentAttemptId), payment.amount, enums_1.EMomoConfirmType.CANCEL);
        await session.paymentRepository.createTransaction(new entities_1.PaymentTransactionEntity((0, crypto_1.randomUUID)(), lastAttempt.paymentAttemptId, JSON.stringify(requestPayload), JSON.stringify(responsePayload), enums_1.ETransactionType.CANCELLED, new Date(), new Date()));
        lastAttempt.status = enums_1.EPaymentStatus.CANCELED;
        await session.paymentRepository.updateAttempt(lastAttempt);
        payment.syncStatusFromLatestAttempt();
        const updatedPayment = await session.paymentRepository.update(payment);
        return updatedPayment;
    }
    async handleIPN(body, session) {
        try {
            this.logger.log(`Processing Momo IPN for order: ${body.orderId}, resultCode: ${body.resultCode}`);
            if (!body.orderId || !body.signature || body.resultCode === undefined) {
                throw new common_1.BadRequestException('Missing required IPN fields');
            }
            const payment = await session.paymentRepository.findByAttemptId(this.extractMomoOrderId(body.orderId));
            if (!payment) {
                this.logger.warn(`Payment not found for Momo order: ${body.orderId}`);
                throw new common_1.BadRequestException('Payment not found!');
            }
            const { accessKey, secretKey, partnerCode, momoUrl } = this.loadMomoConfig();
            const rawSignature = `accessKey=${accessKey}` +
                `&amount=${body.amount}` +
                `&extraData=${body.extraData}` +
                `&message=${body.message}` +
                `&orderId=${body.orderId}` +
                `&orderInfo=${body.orderInfo}` +
                `&orderType=${body.orderType}` +
                `&partnerCode=${body.partnerCode}` +
                `&payType=${body.payType}` +
                `&requestId=${body.requestId}` +
                `&responseTime=${body.responseTime}` +
                `&resultCode=${body.resultCode}` +
                `&transId=${body.transId}`;
            const signature = (0, hash_helper_1.hashSHA256)(rawSignature, secretKey);
            if (signature !== body.signature) {
                this.logger.error(`Invalid Momo signature for order: ${body.orderId}`);
                throw new common_1.BadRequestException('Invalid Momo signature!');
            }
            const attemptId = this.extractMomoOrderId(body.orderId);
            const latestAttempt = payment.getAttemptById(attemptId);
            if (!latestAttempt) {
                this.logger.error(`No payment attempt found for payment: ${payment.paymentId}`);
                throw new common_1.BadRequestException('No payment attempt found!');
            }
            if ([enums_1.EPaymentStatus.CAPTURED].includes(latestAttempt.status)) {
                this.logger.warn(`Momo IPN: Order ${body.orderId} already processed with status ${payment.status}`);
                return {
                    response: null,
                    payment: payment,
                };
            }
            await session.paymentRepository.createTransaction(new entities_1.PaymentTransactionEntity((0, crypto_1.randomUUID)(), latestAttempt.paymentAttemptId, JSON.stringify({}), JSON.stringify(body), enums_1.ETransactionType.WEBHOOK, new Date(), new Date()));
            if (latestAttempt.status === enums_1.EPaymentStatus.CANCELED) {
                this.logger.warn(`Payment canceled for order: ${body.orderId}, attempting to cancel transaction`);
                try {
                    const { requestPayload, responsePayload } = await this.momoConfirm(accessKey, secretKey, partnerCode, body.orderId, body.amount, enums_1.EMomoConfirmType.CANCEL);
                    await this.paymentRepository.createTransaction(new entities_1.PaymentTransactionEntity((0, crypto_1.randomUUID)(), latestAttempt.paymentAttemptId, JSON.stringify(requestPayload), JSON.stringify(responsePayload), enums_1.ETransactionType.CANCELLED, new Date(), new Date()));
                    this.logger.log(`Successfully cancelled transaction: ${body.orderId}`);
                }
                catch (cancelError) {
                    this.logger.error(`Failed to cancel transaction: ${body.orderId}`, cancelError.message);
                }
                throw new common_1.BadRequestException('Payment canceled!');
            }
            let newAttemptStatus;
            if (body.resultCode === 9000) {
                try {
                    const { requestPayload, responsePayload } = await this.momoConfirm(accessKey, secretKey, partnerCode, body.orderId, body.amount, enums_1.EMomoConfirmType.CAPTURE);
                    await session.paymentRepository.createTransaction(new entities_1.PaymentTransactionEntity((0, crypto_1.randomUUID)(), latestAttempt.paymentAttemptId, JSON.stringify(requestPayload), JSON.stringify(responsePayload), enums_1.ETransactionType.CAPTURED, new Date(), new Date()));
                    if (responsePayload.resultCode !== 0) {
                        this.logger.error(`Momo confirm failed for order: ${body.orderId}, code: ${responsePayload.resultCode}`);
                        throw new common_1.BadRequestException(`Momo confirm failed: ${responsePayload.message}`);
                    }
                    newAttemptStatus = enums_1.EPaymentStatus.CAPTURED;
                    this.logger.log(`Successfully confirmed Momo payment: ${body.orderId}`);
                }
                catch (confirmError) {
                    this.logger.error(`Confirm error for order: ${body.orderId}`, confirmError.message);
                    newAttemptStatus = enums_1.EPaymentStatus.FAILED;
                }
            }
            else if (body.resultCode === 0) {
                newAttemptStatus = enums_1.EPaymentStatus.CAPTURED;
                this.logger.log(`Momo payment successful: ${body.orderId}`);
            }
            else {
                newAttemptStatus = enums_1.EPaymentStatus.FAILED;
                this.logger.log(`Momo payment failed: ${body.orderId}, reason: ${body.message}`);
            }
            latestAttempt.status = newAttemptStatus;
            latestAttempt.updatedAt = new Date();
            await session.paymentRepository.updateAttempt(latestAttempt);
            this.logger.log(`Payment attempt status updated for order: ${body.orderId}, status: ${newAttemptStatus}`);
            payment.syncStatusFromLatestAttempt();
            await session.paymentRepository.update(payment);
            this.logger.log(`Payment status synced for order: ${body.orderId}, payment status: ${payment.status}`);
            return {
                response: '',
                payment: payment,
            };
        }
        catch (error) {
            this.logger.error(`Momo IPN processing failed for order: ${body.orderId}`, error.stack);
            return {
                response: '',
                payment: undefined,
            };
        }
    }
    async momoConfirm(accessKey, secretKey, partnerCode, order_momo_id, amount, type) {
        try {
            const { momoUrl } = this.loadMomoConfig();
            if (!momoUrl) {
                throw new common_1.BadRequestException('Momo payment not configured!');
            }
            const requestId = (0, crypto_1.randomUUID)();
            const bodyConfirm = {
                partnerCode,
                requestId,
                orderId: order_momo_id,
                requestType: type,
                lang: 'vi',
                amount,
                description: 'Payment confirmation',
                signature: '',
            };
            const rawSignatureConfirm = `accessKey=${accessKey}` +
                `&amount=${bodyConfirm.amount}` +
                `&description=${bodyConfirm.description}` +
                `&orderId=${bodyConfirm.orderId}` +
                `&partnerCode=${partnerCode}` +
                `&requestId=${requestId}` +
                `&requestType=${bodyConfirm.requestType}`;
            const signatureConfirm = (0, hash_helper_1.hashSHA256)(rawSignatureConfirm, secretKey);
            bodyConfirm.signature = signatureConfirm;
            const resultConfirm = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${momoUrl}/confirm`, bodyConfirm));
            const response = resultConfirm.data;
            if (response.resultCode !== 0) {
                throw new common_1.BadRequestException(`[Code: ${response.resultCode}]: ${response.message}`);
            }
            return {
                requestPayload: bodyConfirm,
                responsePayload: response,
            };
        }
        catch (error) {
            console.error('[Momo Confirm Error]', error.response?.data || error.message);
            throw new common_1.BadRequestException(error.response?.data || error.message);
        }
    }
    generateMomoOrderId(attemptId) {
        return `${'A4S-'}${attemptId}`;
    }
    extractMomoOrderId(orderId) {
        return orderId.replace(/^A4S-/, '');
    }
    loadMomoConfig() {
        const accessKey = process.env.MOMO_ACCESS_KEY;
        const secretKey = process.env.MOMO_SECRET_KEY;
        const partnerCode = process.env.MOMO_PARTNER_CODE;
        const momoUrl = process.env.NODE_ENV === 'production'
            ? process.env.MOMO_URL
            : process.env.MOMO_URL_TEST;
        if (!accessKey || !secretKey || !partnerCode || !momoUrl) {
            throw new common_1.BadRequestException('Momo payment: Missing configuration for MoMo payment gateway!');
        }
        return { accessKey, secretKey, partnerCode, momoUrl };
    }
};
exports.MomoService = MomoService;
exports.MomoService = MomoService = MomoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(interfaces_1.PAYMENT_REPOSITORY)),
    __metadata("design:paramtypes", [http_service_1.HttpService, Object])
], MomoService);
//# sourceMappingURL=momo.service.js.map