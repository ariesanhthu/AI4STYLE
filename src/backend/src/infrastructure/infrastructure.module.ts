import { Module } from "@nestjs/common";

// Common services
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CACHE_SERVICE, LOGGER_SERVICE, TOKEN_SERVICE } from "@/shared/interfaces";
import { NestTokenService } from "./services/token";
import { CacheModule } from "@nestjs/cache-manager";
import { NestCacheService } from "./services/cache";
import { NestLoggerService } from "./services/logger";

// Database
import { PrismaModule } from "./prisma/prisma.module";

// Authentication
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./services/auth-strategies";

// Storage
import { STORAGE_PROVIDER } from "@/core/upload/interfaces";
import { CloudinaryStorageProvider } from "./services/cloudinary";

// Payment
import { IProvider, PAYMENT_PROVIDERS, PROVIDER_DISCOVERY } from "@/core/payment/interfaces";
import { CashService, MomoService, ProviderDiscoveryService } from "./services/payment-providers";
import { HttpModule } from "@nestjs/axios";

const LIST_PAYMENT_PROVIDERS = [CashService, MomoService];


@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<number>('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({ isGlobal: true }),
    PrismaModule,
    HttpModule
  ],
  providers: [
    // Common providers
    {
      provide: TOKEN_SERVICE,
      useClass: NestTokenService,
    },
    {
      provide: LOGGER_SERVICE,
      useClass: NestLoggerService,
    },
    {
      provide: CACHE_SERVICE,
      useClass: NestCacheService,
    },
    
    // Authentication strategy providers
    JwtStrategy,

    // Storage providers
    {
      provide: STORAGE_PROVIDER,
      useClass: CloudinaryStorageProvider,
    },

    // Payment providers
    ...LIST_PAYMENT_PROVIDERS,
    {
      provide: PAYMENT_PROVIDERS,
      useFactory: (...providers) => {
        const providerMap: { [key in string]: IProvider } = {};
        providers.forEach((provider) => {
          providerMap[provider.type] = provider;
        });
        return providerMap;
      },
      inject: LIST_PAYMENT_PROVIDERS,
    },
    {
      provide: PROVIDER_DISCOVERY,
      useClass: ProviderDiscoveryService,
    },

    
  ],
  exports: [
    TOKEN_SERVICE,
    LOGGER_SERVICE,
    CACHE_SERVICE,
    PrismaModule,
    STORAGE_PROVIDER,
    PROVIDER_DISCOVERY
  ]
})
export class InfrastructureModule { }
