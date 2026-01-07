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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodClientController = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../../application/payment-method/services");
const swagger_1 = require("@nestjs/swagger");
const dtos_1 = require("../../../application/payment-method/dtos");
const decorators_1 = require("../../guards/decorators");
const enums_1 = require("../../../shared/enums");
const dtos_2 = require("../../../shared/dtos");
let PaymentMethodClientController = class PaymentMethodClientController {
    paymentMethodService;
    constructor(paymentMethodService) {
        this.paymentMethodService = paymentMethodService;
    }
    getAllPaymentMethods() {
        return this.paymentMethodService.getAllPaymentMethods();
    }
};
exports.PaymentMethodClientController = PaymentMethodClientController;
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_1.paymentMethodResponseSchema.array(),
        description: 'Payment methods retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available payment methods' }),
    (0, decorators_1.Public)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentMethodClientController.prototype, "getAllPaymentMethods", null);
exports.PaymentMethodClientController = PaymentMethodClientController = __decorate([
    (0, swagger_1.ApiTags)(`${enums_1.ESwaggerTagPrefix.CLIENT}-${enums_1.ESwaggerTag.PAYMENT_METHOD}`),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, decorators_1.ApiZodErrorResponse)(dtos_2.errorResponseSchema),
    (0, common_1.Controller)('client/payment-methods'),
    __metadata("design:paramtypes", [services_1.PaymentMethodService])
], PaymentMethodClientController);
//# sourceMappingURL=payment-method-client.controller.js.map