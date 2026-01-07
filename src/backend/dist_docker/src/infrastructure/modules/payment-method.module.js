"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodModule = void 0;
const common_1 = require("@nestjs/common");
const payment_method_1 = require("../../presentation/controllers/payment-method");
const services_1 = require("../../application/payment-method/services");
const interfaces_1 = require("../../core/payment-method/interfaces");
const infrastructure_module_1 = require("../infrastructure.module");
const interfaces_2 = require("../../shared/interfaces");
const core_1 = require("@nestjs/core");
const filters_1 = require("../https/filters");
let PaymentMethodModule = class PaymentMethodModule {
};
exports.PaymentMethodModule = PaymentMethodModule;
exports.PaymentMethodModule = PaymentMethodModule = __decorate([
    (0, common_1.Module)({
        imports: [infrastructure_module_1.InfrastructureModule],
        controllers: [payment_method_1.PaymentMethodClientController],
        providers: [
            {
                provide: services_1.PaymentMethodService,
                useFactory: (paymentMethodRepository, logger) => {
                    return new services_1.PaymentMethodService(paymentMethodRepository, logger);
                },
                inject: [interfaces_1.PAYMENT_METHOD_REPOSITORY, interfaces_2.LOGGER_SERVICE],
            },
            {
                provide: core_1.APP_FILTER,
                useClass: filters_1.PaymentMethodExceptionFilter
            }
        ],
        exports: [services_1.PaymentMethodService],
    })
], PaymentMethodModule);
//# sourceMappingURL=payment-method.module.js.map