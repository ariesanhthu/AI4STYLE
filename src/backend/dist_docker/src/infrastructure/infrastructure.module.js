"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfrastructureModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const interfaces_1 = require("../shared/interfaces");
const token_1 = require("./services/token");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_1 = require("./services/cache");
const logger_1 = require("./services/logger");
const prisma_module_1 = require("./prisma/prisma.module");
const jwt_1 = require("@nestjs/jwt");
const auth_strategies_1 = require("./services/auth-strategies");
const interfaces_2 = require("../core/upload/interfaces");
const cloudinary_1 = require("./services/cloudinary");
const interfaces_3 = require("../core/payment/interfaces");
const payment_providers_1 = require("./services/payment-providers");
const axios_1 = require("@nestjs/axios");
const LIST_PAYMENT_PROVIDERS = [payment_providers_1.CashService, payment_providers_1.MomoService];
const schedule_1 = require("@nestjs/schedule");
const best_seller_scheduler_service_1 = require("./scheduler/best-seller-scheduler.service");
let InfrastructureModule = class InfrastructureModule {
};
exports.InfrastructureModule = InfrastructureModule;
exports.InfrastructureModule = InfrastructureModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: configService.get('JWT_EXPIRATION') },
                }),
                inject: [config_1.ConfigService],
            }),
            cache_manager_1.CacheModule.register({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            axios_1.HttpModule
        ],
        providers: [
            best_seller_scheduler_service_1.BestSellerSchedulerService,
            {
                provide: interfaces_1.TOKEN_SERVICE,
                useClass: token_1.NestTokenService,
            },
            {
                provide: interfaces_1.LOGGER_SERVICE,
                useClass: logger_1.NestLoggerService,
            },
            {
                provide: interfaces_1.CACHE_SERVICE,
                useClass: cache_1.NestCacheService,
            },
            auth_strategies_1.JwtStrategy,
            {
                provide: interfaces_2.STORAGE_PROVIDER,
                useClass: cloudinary_1.CloudinaryStorageProvider,
            },
            ...LIST_PAYMENT_PROVIDERS,
            {
                provide: interfaces_3.PAYMENT_PROVIDERS,
                useFactory: (...providers) => {
                    const providerMap = {};
                    providers.forEach((provider) => {
                        providerMap[provider.type] = provider;
                    });
                    return providerMap;
                },
                inject: LIST_PAYMENT_PROVIDERS,
            },
            {
                provide: interfaces_3.PROVIDER_DISCOVERY,
                useClass: payment_providers_1.ProviderDiscoveryService,
            },
        ],
        exports: [
            interfaces_1.TOKEN_SERVICE,
            interfaces_1.LOGGER_SERVICE,
            interfaces_1.CACHE_SERVICE,
            prisma_module_1.PrismaModule,
            interfaces_2.STORAGE_PROVIDER,
            interfaces_3.PROVIDER_DISCOVERY
        ]
    })
], InfrastructureModule);
//# sourceMappingURL=infrastructure.module.js.map