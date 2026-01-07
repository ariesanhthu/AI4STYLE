"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../application/user/services");
const user_1 = require("../../presentation/controllers/user");
const interfaces_1 = require("../../core/user/interfaces");
const infrastructure_module_1 = require("../infrastructure.module");
const interfaces_2 = require("../../shared/interfaces");
const core_1 = require("@nestjs/core");
const filters_1 = require("../https/filters");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [infrastructure_module_1.InfrastructureModule],
        controllers: [user_1.UserClientController, user_1.UserAdminController],
        providers: [
            {
                provide: services_1.UserService,
                useFactory: (userRepository, logger) => {
                    return new services_1.UserService(userRepository, logger);
                },
                inject: [interfaces_1.USER_REPOSITORY, interfaces_2.LOGGER_SERVICE],
            },
            {
                provide: core_1.APP_FILTER,
                useClass: filters_1.UserExceptionFilter
            }
        ],
        exports: [services_1.UserService],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map