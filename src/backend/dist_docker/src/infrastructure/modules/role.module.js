"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModule = void 0;
const role_1 = require("../../presentation/controllers/role");
const common_1 = require("@nestjs/common");
const interfaces_1 = require("../../core/role/interfaces");
const services_1 = require("../../application/role/services");
const infrastructure_module_1 = require("../infrastructure.module");
const interfaces_2 = require("../../shared/interfaces");
const core_1 = require("@nestjs/core");
const filters_1 = require("../https/filters");
let RoleModule = class RoleModule {
};
exports.RoleModule = RoleModule;
exports.RoleModule = RoleModule = __decorate([
    (0, common_1.Module)({
        imports: [infrastructure_module_1.InfrastructureModule],
        controllers: [role_1.RoleAdminController],
        providers: [
            {
                provide: services_1.RoleService,
                useFactory: (roleRepository, logger) => {
                    return new services_1.RoleService(roleRepository, logger);
                },
                inject: [interfaces_1.ROLE_REPOSITORY, interfaces_2.LOGGER_SERVICE],
            },
            {
                provide: core_1.APP_FILTER,
                useClass: filters_1.RoleExceptionFilter
            }
        ],
        exports: [services_1.RoleService],
    })
], RoleModule);
//# sourceMappingURL=role.module.js.map