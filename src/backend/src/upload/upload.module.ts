import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UploadService } from "./upload.service";
import { UploadAdminController } from "./upload-admin.controller";
import { ImageRepository } from "./repositories/image.repository";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [UploadAdminController],
  providers: [
    UploadService,
    {
      provide: "ImageRepository",
      useClass: ImageRepository,
    },
  ],
  exports: [UploadService],
})
export class UploadModule {}
