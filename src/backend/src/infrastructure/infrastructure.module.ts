import { CACHE_SERVICE, LOGGER_SERVICE, TOKEN_SERVICE } from "@/shared/interfaces";
import { Module } from "@nestjs/common";
import { NestTokenService } from "./token/nest-token.service";
import { NestCacheService } from "./cache/nest-cache.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";
import { NestLoggerService } from "./logger/nest-logger.service";

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
  ],
  providers: [
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
  ],
  exports: [TOKEN_SERVICE, LOGGER_SERVICE, CACHE_SERVICE]
})
export class InfrastructureModule { }
