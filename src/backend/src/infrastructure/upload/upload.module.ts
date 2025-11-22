import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadAdminController } from '@/presentation/upload/controllers';
import { UploadService } from '@/application/upload/services';
import { IMAGE_REPOSITORY, STORAGE_PROVIDER } from '@/core/upload/interfaces';
import { PrismaModule } from '../prisma/prisma.module';
import { ImageRepository } from './repositories/image.repository';
import { CloudinaryStorageProvider } from './providers';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [UploadAdminController],
  providers: [
    UploadService,
    {
      provide: IMAGE_REPOSITORY,
      useClass: ImageRepository,
    },
    {
      provide: STORAGE_PROVIDER,
      useClass: CloudinaryStorageProvider,
    },
  ],
  exports: [UploadService, IMAGE_REPOSITORY, STORAGE_PROVIDER],
})
export class UploadModule {}
