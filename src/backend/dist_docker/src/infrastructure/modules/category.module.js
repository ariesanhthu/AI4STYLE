"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModule = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../application/category/services");
const interfaces_1 = require("../../core/category/interfaces");
const category_1 = require("../../presentation/controllers/category");
const infrastructure_module_1 = require("../infrastructure.module");
const interfaces_2 = require("../../shared/interfaces");
const core_1 = require("@nestjs/core");
const filters_1 = require("../https/filters");
let CategoryModule = class CategoryModule {
};
exports.CategoryModule = CategoryModule;
exports.CategoryModule = CategoryModule = __decorate([
    (0, common_1.Module)({
        imports: [infrastructure_module_1.InfrastructureModule],
        controllers: [category_1.CategoryAdminController, category_1.CategoryClientController],
        providers: [
            {
                provide: services_1.CategoryValidationService,
                useFactory: (categoryRepository, logger) => {
                    return new services_1.CategoryValidationService(categoryRepository, logger);
                },
                inject: [interfaces_1.CATEGORY_REPOSITORY, interfaces_2.LOGGER_SERVICE],
            },
            {
                provide: services_1.CategoryService,
                useFactory: (categoryRepository, validationService, logger) => {
                    return new services_1.CategoryService(categoryRepository, validationService, logger);
                },
                inject: [interfaces_1.CATEGORY_REPOSITORY, services_1.CategoryValidationService, interfaces_2.LOGGER_SERVICE],
            },
            {
                provide: core_1.APP_FILTER,
                useClass: filters_1.CategoryExceptionFilter
            }
        ],
        exports: [services_1.CategoryService],
    })
], CategoryModule);
//# sourceMappingURL=category.module.js.map