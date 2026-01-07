"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const interfaces_1 = require("../../core/payment/interfaces");
const payment_1 = require("../../presentation/controllers/payment");
const services_1 = require("../../application/payment/services");
const infrastructure_module_1 = require("../infrastructure.module");
const interfaces_2 = require("../../shared/interfaces");
const core_1 = require("@nestjs/core");
const filters_1 = require("../https/filters");
const shared_1 = require("../../application/shared");
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [infrastructure_module_1.InfrastructureModule],
        controllers: [payment_1.PaymentClientController, payment_1.PaymentAdminController],
        providers: [
            {
                provide: services_1.PaymentService,
                useFactory: (providerDiscoveryService, paymentRepository, logger, unitOfWork) => {
                    return new services_1.PaymentService(providerDiscoveryService, paymentRepository, logger, unitOfWork);
                },
                inject: [
                    interfaces_1.PROVIDER_DISCOVERY,
                    interfaces_1.PAYMENT_REPOSITORY,
                    interfaces_2.LOGGER_SERVICE,
                    shared_1.UNIT_OF_WORK
                ],
            },
            {
                provide: core_1.APP_FILTER,
                useClass: filters_1.PaymentExceptionFilter
            }
        ],
        exports: [services_1.PaymentService],
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map