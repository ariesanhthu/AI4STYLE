"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../application/order/services");
const order_1 = require("../../presentation/controllers/order");
const interfaces_1 = require("../../core/order/interfaces");
const infrastructure_module_1 = require("../infrastructure.module");
const interfaces_2 = require("../../shared/interfaces");
const core_1 = require("@nestjs/core");
const filters_1 = require("../https/filters");
const shared_1 = require("../../application/shared");
let OrderModule = class OrderModule {
};
exports.OrderModule = OrderModule;
exports.OrderModule = OrderModule = __decorate([
    (0, common_1.Module)({
        imports: [infrastructure_module_1.InfrastructureModule],
        controllers: [order_1.OrderAdminController, order_1.OrderClientController],
        providers: [
            {
                provide: services_1.OrderService,
                useFactory: (orderRepository, logger, unitOfWork) => {
                    return new services_1.OrderService(orderRepository, logger, unitOfWork);
                },
                inject: [
                    interfaces_1.ORDER_REPOSITORY,
                    interfaces_2.LOGGER_SERVICE,
                    shared_1.UNIT_OF_WORK,
                ],
            },
            {
                provide: core_1.APP_FILTER,
                useClass: filters_1.OrderExceptionFilter
            }
        ],
        exports: [services_1.OrderService],
    })
], OrderModule);
//# sourceMappingURL=order.module.js.map