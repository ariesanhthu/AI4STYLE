"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const health_module_1 = require("./infrastructure/health/health.module");
const core_1 = require("@nestjs/core");
const guards_1 = require("./presentation/guards");
const interceptors_1 = require("./presentation/interceptors");
const filters_1 = require("./presentation/filters");
const middlewares_1 = require("./presentation/middlewares");
const infrastructure_module_1 = require("./infrastructure/infrastructure.module");
const prisma_module_1 = require("./infrastructure/prisma/prisma.module");
const modules_1 = require("./infrastructure/modules");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(middlewares_1.LoggerResponseTimeMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `.env`,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 20,
                },
            ]),
            infrastructure_module_1.InfrastructureModule,
            prisma_module_1.PrismaModule,
            health_module_1.HealthModule,
            modules_1.RoleModule,
            modules_1.UserModule,
            modules_1.AuthModule,
            modules_1.UploadModule,
            modules_1.CategoryModule,
            modules_1.ProductModule,
            modules_1.OrderModule,
            modules_1.PaymentMethodModule,
            modules_1.PaymentModule,
            modules_1.DashboardModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: guards_1.JwtGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: guards_1.ApiKeyGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: guards_1.PermissionGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: interceptors_1.ResponseInterceptor,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: filters_1.GlobalExceptionFilter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map