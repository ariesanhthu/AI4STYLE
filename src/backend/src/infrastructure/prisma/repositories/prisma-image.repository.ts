import { ImageEntity } from '@/core/upload/entities';
import { IImageRepository } from '@/core/upload/interfaces';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { PaginationCursorQueryDto } from '@/shared/dtos';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PrismaImageRepository implements IImageRepository {
  private readonly logger = new Logger(PrismaImageRepository.name);

  constructor(private readonly prisma: PrismaService) { }

  async create(newEntity: ImageEntity): Promise<ImageEntity> {
    try {
      const created = await this.prisma.image.create({
        data: {
          id: newEntity.id,
          title: newEntity.title,
          url: newEntity.url,
          format: newEntity.format,
          size: newEntity.size,
          createdAt: newEntity.createdAt,
          updatedAt: newEntity.updatedAt,
        },
      });
      return this.toEntity(created);
    } catch (error) {
      this.logger.error(`Failed to create image: ${error.message}`);
      throw error;
    }
  }

  async findById(id: string): Promise<ImageEntity | null> {
    try {
      const image = await this.prisma.image.findUnique({
        where: { id },
      });
      return image ? this.toEntity(image) : null;
    } catch (error) {
      this.logger.error(`Failed to find image by id: ${error.message}`);
      return null;
    }
  }

  async findAll(query: PaginationCursorQueryDto): Promise<ImageEntity[]> {
    try {
      const images = await this.prisma.image.findMany({
        take: query.limit,
        skip: query.cursor ? 1 : 0,
        cursor: query.cursor ? { id: query.cursor } : undefined,
        orderBy: { createdAt: query.sortOrder },
      });
      return images.map((image) => this.toEntity(image));
    } catch (error) {
      this.logger.error(`Failed to find all images: ${error.message}`);
      return [];
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.image.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete image: ${error.message}`);
      return false;
    }
  }

  toEntity(raw: any): ImageEntity {
    return new ImageEntity(
      raw.id,
      raw.title,
      raw.url,
      raw.format,
      raw.size,
      raw.createdAt,
      raw.updatedAt,
    );
  }
}
