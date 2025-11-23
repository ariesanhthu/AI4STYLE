import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadAdminController } from '@/presentation/upload/controllers';
import { UploadService } from '@/application/upload/services';
import {
  IMAGE_REPOSITORY,
  STORAGE_PROVIDER,
  type IImageRepository,
  type IStorageProvider,
} from '@/core/upload/interfaces';
import { PrismaModule } from '../prisma/prisma.module';
import { ImageRepository } from './repositories/image.repository';
import { CloudinaryStorageProvider } from './providers';
import { InfrastructureModule } from '../infrastructure.module';
import { ILoggerService, LOGGER_SERVICE } from '@/shared/interfaces';
import { APP_FILTER } from '@nestjs/core';
import { UploadExceptionFilter } from '../https/filters';

@Module({
  imports: [ConfigModule, PrismaModule, InfrastructureModule],
  controllers: [UploadAdminController],
  providers: [
    {
      provide: IMAGE_REPOSITORY,
      useClass: ImageRepository,
    },
    {
      provide: STORAGE_PROVIDER,
      useClass: CloudinaryStorageProvider,
    },
    {
      provide: UploadService,
      useFactory: (
        imageRepository: IImageRepository,
        storageProvider: IStorageProvider,
        logger: ILoggerService,
      ) => {
        return new UploadService(imageRepository, storageProvider, logger);
      },
      inject: [IMAGE_REPOSITORY, STORAGE_PROVIDER, LOGGER_SERVICE],
    },
    {
      provide: APP_FILTER,
      useClass: UploadExceptionFilter
    }    
  ],
  exports: [UploadService, IMAGE_REPOSITORY, STORAGE_PROVIDER],
})
export class UploadModule { }
