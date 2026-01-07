"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../application/auth/services");
const auth_admin_controller_1 = require("../../presentation/controllers/auth/auth-admin.controller");
const auth_1 = require("../../presentation/controllers/auth");
const interfaces_1 = require("../../core/user/interfaces");
const interfaces_2 = require("../../core/role/interfaces");
const interfaces_3 = require("../../shared/interfaces");
const infrastructure_module_1 = require("../infrastructure.module");
const core_1 = require("@nestjs/core");
const filters_1 = require("../https/filters");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            infrastructure_module_1.InfrastructureModule,
        ],
        controllers: [auth_admin_controller_1.AuthAdminController, auth_1.AuthClientController],
        providers: [
            {
                provide: services_1.AuthService,
                useFactory: (userRepository, roleRepository, tokenService, cacheService, loggerService) => {
                    return new services_1.AuthService(userRepository, roleRepository, tokenService, cacheService, loggerService);
                },
                inject: [
                    interfaces_1.USER_REPOSITORY,
                    interfaces_2.ROLE_REPOSITORY,
                    interfaces_3.TOKEN_SERVICE,
                    interfaces_3.CACHE_SERVICE,
                    interfaces_3.LOGGER_SERVICE,
                ],
            },
            {
                provide: core_1.APP_FILTER,
                useClass: filters_1.AuthExceptionFilter
            }
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map