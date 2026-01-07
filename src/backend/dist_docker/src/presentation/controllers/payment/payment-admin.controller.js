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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentAdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dtos_1 = require("../../../application/payment/dtos");
const base_payment_controller_1 = require("./base-payment.controller");
const enums_1 = require("../../../shared/enums");
const decorators_1 = require("../../guards/decorators");
const dtos_2 = require("../../../shared/dtos");
const services_1 = require("../../../application/payment/services");
const enums_2 = require("../../../core/payment-method/enums");
let PaymentAdminController = class PaymentAdminController extends base_payment_controller_1.BasePaymentController {
    paymentService;
    constructor(paymentService) {
        super(paymentService);
        this.paymentService = paymentService;
    }
    getListOfPayments(query) {
        return this.paymentService.getListOfPayments(query);
    }
    capturePayment(id) {
        return this.paymentService.capturePayment(id);
    }
    cancelPayment(id) {
        return this.paymentService.cancelPayment(id);
    }
    refundPayment(id) {
        return this.paymentService.refundPayment(id);
    }
    handleMoMoIPN(payload) {
        return this.paymentService.handleProviderWebhook(enums_2.EPaymentMethod.MOMO, payload);
    }
};
exports.PaymentAdminController = PaymentAdminController;
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: (0, dtos_2.createPaginationCursorResponseSchema)(dtos_1.paymentResponseSchema),
        description: 'List of payments retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Get list of payments with filtering and pagination',
    }),
    (0, decorators_1.ApiZodQuery)(dtos_1.getListOfPaymentsQuerySchema),
    (0, common_1.Get)(),
    __param(0, (0, decorators_1.ZodQuery)(dtos_1.getListOfPaymentsQuerySchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentAdminController.prototype, "getListOfPayments", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_1.paymentResponseSchema,
        description: 'Payment captured successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Capture a payment' }),
    (0, common_1.Post)(':id/capture'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentAdminController.prototype, "capturePayment", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_2.statusResponseSchema,
        description: 'Payment canceled successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a payment' }),
    (0, common_1.Post)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentAdminController.prototype, "cancelPayment", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_2.statusResponseSchema,
        description: 'Payment canceled successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a payment' }),
    (0, common_1.Post)(':id/refund'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentAdminController.prototype, "refundPayment", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_2.statusResponseSchema,
        description: 'MoMo IPN handled successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Handle MoMo IPN webhook' }),
    (0, decorators_1.Webhook)(),
    (0, decorators_1.Public)(),
    (0, common_1.Post)('momo/ipn'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentAdminController.prototype, "handleMoMoIPN", null);
exports.PaymentAdminController = PaymentAdminController = __decorate([
    (0, swagger_1.ApiTags)(`${enums_1.ESwaggerTagPrefix.ADMIN}-${enums_1.ESwaggerTag.PAYMENT}`),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, decorators_1.ApiZodErrorResponse)(dtos_2.errorResponseSchema),
    (0, decorators_1.Permissions)(enums_1.EPermission.ORDER_MANAGEMENT),
    (0, common_1.Controller)('admin/payments'),
    __metadata("design:paramtypes", [services_1.PaymentService])
], PaymentAdminController);
//# sourceMappingURL=payment-admin.controller.js.map