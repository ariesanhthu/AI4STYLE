"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const shared_1 = require("../../application/shared");
const prisma_unit_of_work_1 = require("./unit-of-work/prisma-unit-of-work");
const interfaces_1 = require("../../core/category/interfaces");
const repositories_1 = require("./repositories");
const interfaces_2 = require("../../core/order/interfaces");
const interfaces_3 = require("../../core/product/interfaces");
const interfaces_4 = require("../../core/payment/interfaces");
const interfaces_5 = require("../../core/payment-method/interfaces");
const interfaces_6 = require("../../core/user/interfaces");
const interfaces_7 = require("../../core/role/interfaces");
const interfaces_8 = require("../../core/upload/interfaces");
const interfaces_9 = require("../../core/dashboard/interfaces");
const repositories_2 = require("./repositories");
let PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = __decorate([
    (0, common_1.Module)({
        providers: [
            prisma_service_1.PrismaService,
            {
                provide: interfaces_1.CATEGORY_REPOSITORY,
                useClass: repositories_1.PrismaCategoryRepository,
            },
            {
                provide: interfaces_2.ORDER_REPOSITORY,
                useClass: repositories_1.PrismaOrderRepository,
            },
            {
                provide: interfaces_3.PRODUCT_REPOSITORY,
                useClass: repositories_1.PrismaProductRepository,
            },
            {
                provide: interfaces_4.PAYMENT_REPOSITORY,
                useClass: repositories_1.PrismaPaymentRepository,
            },
            {
                provide: interfaces_5.PAYMENT_METHOD_REPOSITORY,
                useClass: repositories_1.PrismaPaymentMethodRepository,
            },
            {
                provide: interfaces_6.USER_REPOSITORY,
                useClass: repositories_1.PrismaUserRepository,
            },
            {
                provide: interfaces_7.ROLE_REPOSITORY,
                useClass: repositories_1.PrismaRoleRepository,
            },
            {
                provide: interfaces_8.IMAGE_REPOSITORY,
                useClass: repositories_1.PrismaImageRepository,
            },
            {
                provide: interfaces_9.DASHBOARD_REPOSITORY,
                useClass: repositories_2.PrismaDashboardRepository,
            },
            {
                provide: shared_1.UNIT_OF_WORK,
                useClass: prisma_unit_of_work_1.PrismaUnitOfWork,
            }
        ],
        exports: [
            prisma_service_1.PrismaService,
            shared_1.UNIT_OF_WORK,
            interfaces_1.CATEGORY_REPOSITORY,
            interfaces_2.ORDER_REPOSITORY,
            interfaces_3.PRODUCT_REPOSITORY,
            interfaces_4.PAYMENT_REPOSITORY,
            interfaces_5.PAYMENT_METHOD_REPOSITORY,
            interfaces_6.USER_REPOSITORY,
            interfaces_7.ROLE_REPOSITORY,
            interfaces_8.IMAGE_REPOSITORY,
            interfaces_9.DASHBOARD_REPOSITORY,
        ],
    })
], PrismaModule);
//# sourceMappingURL=prisma.module.js.map