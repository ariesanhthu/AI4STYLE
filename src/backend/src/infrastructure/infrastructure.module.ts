import { Module } from "@nestjs/common";

// Common services
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AI_EMBEDDING_SERVICE, GROQ_SERVICE, VECTOR_SEARCH_SERVICE, CACHE_SERVICE, LOGGER_SERVICE, TOKEN_SERVICE } from "@/shared/interfaces";
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

// Scheduler
import { ScheduleModule } from '@nestjs/schedule';
import { BestSellerSchedulerService } from './scheduler/best-seller-scheduler.service';
import { HuggingFaceEmbeddingService } from "./ai/hf-embedding.service";
import { GroqService } from "./ai/groq.service";
import { SupabaseVectorService } from "./services/search-vector/supabase-vector.service";

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
    // Scheduler
    BestSellerSchedulerService,

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

    // AI providers
    {
      provide: AI_EMBEDDING_SERVICE,
      useClass: HuggingFaceEmbeddingService,
    },
    {
      provide: GROQ_SERVICE,
      useClass: GroqService,
    },
    {
      provide: VECTOR_SEARCH_SERVICE,
      useClass: SupabaseVectorService,
    },

  ],
  exports: [
    TOKEN_SERVICE,
    LOGGER_SERVICE,
    CACHE_SERVICE,
    PrismaModule,
    STORAGE_PROVIDER,
    PROVIDER_DISCOVERY,
    AI_EMBEDDING_SERVICE,
    GROQ_SERVICE,
    VECTOR_SEARCH_SERVICE,
  ]
})
export class InfrastructureModule { }
