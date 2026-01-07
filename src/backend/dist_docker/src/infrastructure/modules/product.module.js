"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModule = void 0;
const common_1 = require("@nestjs/common");
const product_1 = require("../../presentation/controllers/product");
const product_repository_interface_1 = require("../../core/product/interfaces/product.repository.interface");
const services_1 = require("../../application/product/services");
const infrastructure_module_1 = require("../infrastructure.module");
const interfaces_1 = require("../../shared/interfaces");
const core_1 = require("@nestjs/core");
const filters_1 = require("../https/filters");
const shared_1 = require("../../application/shared");
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = __decorate([
    (0, common_1.Module)({
        imports: [infrastructure_module_1.InfrastructureModule],
        controllers: [product_1.ProductAdminController, product_1.ProductClientController],
        providers: [
            {
                provide: services_1.ProductService,
                useFactory: (productRepository, logger, uow) => {
                    return new services_1.ProductService(productRepository, logger, uow);
                },
                inject: [product_repository_interface_1.PRODUCT_REPOSITORY, interfaces_1.LOGGER_SERVICE, shared_1.UNIT_OF_WORK],
            },
            {
                provide: core_1.APP_FILTER,
                useClass: filters_1.ProductExceptionFilter
            }
        ],
        exports: [services_1.ProductService],
    })
], ProductModule);
//# sourceMappingURL=product.module.js.map