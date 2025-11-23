import { Injectable, Logger } from '@nestjs/common';
import {
  ICategoryJoinOptions,
  ICategoryRepository,
  ICategoryUniqueCheck,
} from '@/core/category/interfaces';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { CategoryEntity } from '@/core/category/entities';
import { PaginationCursorQueryDto } from '@/shared/dtos';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  private readonly logger = new Logger(CategoryRepository.name);

  constructor(private readonly prisma: PrismaService) { }

  async create(newEntity: CategoryEntity): Promise<CategoryEntity> {
    const created = await this.prisma.category.create({
      data: {
        category_id: newEntity.categoryId,
        parent_id: newEntity.parentId,
        name: newEntity.name,
        slug: newEntity.slug,
        icon: newEntity.icon,
        description: newEntity.description,
        created_at: newEntity.createdAt,
        updated_at: newEntity.updatedAt,
      },
    });
    return this.toEntity(created);
  }

  async findById(
    id: string,
    options?: ICategoryJoinOptions,
  ): Promise<CategoryEntity | null> {
    const category = await this.prisma.category.findUnique({
      where: { category_id: id },
      include: {
        parent: options?.includeParent || false,
      },
    });
    return category ? this.toEntity(category) : null;
  }

  async findBySlug(
    slug: string,
    options?: ICategoryJoinOptions,
  ): Promise<CategoryEntity | null> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: options?.includeParent || false,
      },
    });
    return category ? this.toEntity(category) : null;
  }

  async checkUnique(check: ICategoryUniqueCheck): Promise<boolean> {
    const existingCategory = await this.prisma.category.findFirst({
      where: {
        OR: [{ slug: check.slug }, { name: check.name }],
      },
    });
    return !existingCategory;
  }

  async findAll(
    query: PaginationCursorQueryDto,
    options?: ICategoryJoinOptions,
  ): Promise<CategoryEntity[]> {
    const categories = await this.prisma.category.findMany({
      take: query.limit,
      skip: query.cursor ? 1 : 0,
      cursor: query.cursor ? { category_id: query.cursor } : undefined,
      orderBy: { created_at: query.sortOrder },
      include: {
        parent: options?.includeParent || false,
      },
    });
    return categories.map((category) => this.toEntity(category));
  }

  async update(updatedEntity: CategoryEntity): Promise<CategoryEntity | null> {
    const updated = await this.prisma.category.update({
      where: { category_id: updatedEntity.categoryId },
      data: {
        parent_id: updatedEntity.parentId,
        name: updatedEntity.name,
        slug: updatedEntity.slug,
        icon: updatedEntity.icon,
        description: updatedEntity.description,
        updated_at: updatedEntity.updatedAt,
      },
    });
    return this.toEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.category.delete({
      where: { category_id: id },
    });
    return true;
  }

  toEntity(raw: any): CategoryEntity {
    return new CategoryEntity(
      raw.category_id,
      raw.parent_id,
      raw.name,
      raw.slug,
      raw.icon,
      raw.description,
      raw.created_at,
      raw.updated_at,
      raw.parent ? this.toEntity(raw.parent) : undefined,
    );
  }
}
