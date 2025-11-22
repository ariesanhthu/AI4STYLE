import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IProductJoinOptions,
  IProductOptionJoinOptions,
  IProductRepository,
  IVariantStockPrice,
} from '@/core/product/interfaces';
import {
  GetListProductClientDto,
  GetListProductDto,
} from '@/application/product/dtos';
import {
  ProductEntity,
  ProductOptionEntity,
  ProductVariantEntity,
} from '@/core/product/entities';

@Injectable()
export class ProductRepository implements IProductRepository {
  private readonly logger = new Logger(ProductRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  // ==================== Product Operations ====================

  async findAllProduct(
    query: GetListProductDto,
    options?: IProductJoinOptions,
  ): Promise<ProductEntity[]> {
    // Build where clause for products
    const whereClause: any = {};
    if (query.category_id) {
      whereClause.category_id = query.category_id;
    }
    if (query.is_show !== undefined) {
      whereClause.options = {
        some: {
          is_show: query.is_show,
        },
      };
    }

    // Build where clause for nested options
    const optionsWhere: any = {};
    if (query.is_show !== undefined) {
      optionsWhere.is_show = query.is_show;
    }
    if (query.color_family) {
      optionsWhere.color_family = query.color_family;
    }
    if (query.min_price !== undefined || query.max_price !== undefined) {
      optionsWhere.price = {
        ...(query.min_price !== undefined && { gte: query.min_price }),
        ...(query.max_price !== undefined && { lte: query.max_price }),
      };
    }
    if (query.search) {
      optionsWhere.search = {
        contains: query.search,
        mode: 'insensitive',
      };
    }

    // Build include clause based on options
    const includeClause: any = {};
    if (options?.includeOptions === true) {
      includeClause.options = {
        where: Object.keys(optionsWhere).length > 0 ? optionsWhere : undefined,
        ...(options?.includeVariants === true && {
          include: {
            variants: true,
          },
        }),
      };
    }

    const products = await this.prismaService.product.findMany({
      take: query.limit,
      skip: query.cursor ? 1 : 0,
      cursor: query.cursor ? { product_id: query.cursor } : undefined,
      orderBy: { created_at: query.sortOrder || 'desc' },
      where: whereClause,
      include: includeClause,
    });
    return products.map((product) => this.toProductEntity(product));
  }

  async findProductById(
    id: string,
    options?: IProductJoinOptions,
  ): Promise<ProductEntity | null> {
    console.log('options', options);
    // Build include clause based on options
    const includeClause: any = {};
    if (options?.includeOptions === true) {
      includeClause.options = {
        ...(options?.includeVariants === true && {
          include: {
            variants: true,
          },
        }),
      };
    }

    console.log('includeClause', includeClause);

    const product = await this.prismaService.product.findUnique({
      where: { product_id: id },
      include: includeClause,
    });
    return product ? this.toProductEntity(product) : null;
  }

  async createProduct(product: ProductEntity): Promise<ProductEntity> {
    const created = await this.prismaService.product.create({
      data: {
        product_id: product.productId,
        category_id: product.categoryId,
        name: product.name,
        description: product.description,
        thumbnail: product.thumbnail,
        created_at: product.createdAt,
        updated_at: product.updatedAt,
      },
      include: {
        options: {
          include: {
            variants: true,
          },
        },
      },
    });
    return this.toProductEntity(created);
  }

  async updateProduct(
    id: string,
    product: Partial<ProductEntity>,
  ): Promise<ProductEntity | null> {
    const updated = await this.prismaService.product.update({
      where: { product_id: id },
      data: {
        ...(product.categoryId && { category_id: product.categoryId }),
        ...(product.name && { name: product.name }),
        ...(product.description !== undefined && {
          description: product.description,
        }),
        ...(product.thumbnail !== undefined && {
          thumbnail: product.thumbnail,
        }),
        updated_at: new Date(),
      },
      include: {
        options: {
          include: {
            variants: true,
          },
        },
      },
    });
    return this.toProductEntity(updated);
  }

  async deleteProduct(id: string): Promise<boolean> {
    await this.prismaService.product.delete({
      where: { product_id: id },
    });
    return true;
  }

  // ==================== ProductOption Operations ====================

  async findAllProductOption(
    query: GetListProductClientDto,
    options?: IProductOptionJoinOptions,
  ): Promise<ProductOptionEntity[]> {
    const whereClause: any = {};

    if (query.category_id) {
      whereClause.product = { category_id: query.category_id };
    }
    if (query.color_family) {
      whereClause.color_family = query.color_family;
    }
    if (query.min_price !== undefined || query.max_price !== undefined) {
      whereClause.price = {
        ...(query.min_price !== undefined && { gte: query.min_price }),
        ...(query.max_price !== undefined && { lte: query.max_price }),
      };
    }
    if (query.search) {
      whereClause.search = {
        contains: query.search,
        mode: 'insensitive',
      };
    }

    const productOptions = await this.prismaService.productOption.findMany({
      take: query.limit,
      skip: query.cursor ? 1 : 0,
      cursor: query.cursor ? { option_id: query.cursor } : undefined,
      orderBy: { created_at: query.sortOrder || 'desc' },
      where: whereClause,
      include: {
        variants: options?.includeVariants === true,
      },
    });
    return productOptions.map((option) => this.toProductOptionEntity(option));
  }

  async findProductOptionById(
    id: string,
    options?: IProductOptionJoinOptions,
  ): Promise<ProductOptionEntity | null> {
    const option = await this.prismaService.productOption.findUnique({
      where: { option_id: id },
      include: {
        variants: options?.includeVariants === true,
      },
    });
    return option ? this.toProductOptionEntity(option) : null;
  }

  async createProductOption(
    productOption: ProductOptionEntity,
  ): Promise<ProductOptionEntity> {
    const created = await this.prismaService.productOption.create({
      data: {
        option_id: productOption.optionId,
        product_id: productOption.productId,
        name: productOption.name,
        slug: productOption.slug,
        color: productOption.color,
        color_family: productOption.colorFamily,
        images: productOption.images,
        price: productOption.price,
        new_price: productOption.newPrice,
        out_of_stock: productOption.outOfStock,
        is_show: productOption.isShow,
        search: productOption.search,
        created_at: productOption.createdAt,
        updated_at: productOption.updatedAt,
      },
      include: {
        variants: true,
      },
    });
    return this.toProductOptionEntity(created);
  }

  async updateProductOption(
    id: string,
    productOption: Partial<ProductOptionEntity>,
  ): Promise<ProductOptionEntity | null> {
    const updated = await this.prismaService.productOption.update({
      where: { option_id: id },
      data: {
        ...(productOption.name && { name: productOption.name }),
        ...(productOption.slug && { slug: productOption.slug }),
        ...(productOption.color && { color: productOption.color }),
        ...(productOption.colorFamily && {
          color_family: productOption.colorFamily,
        }),
        ...(productOption.images && { images: productOption.images }),
        ...(productOption.price !== undefined && {
          price: productOption.price,
        }),
        ...(productOption.newPrice !== undefined && {
          new_price: productOption.newPrice,
        }),
        ...(productOption.outOfStock !== undefined && {
          out_of_stock: productOption.outOfStock,
        }),
        ...(productOption.isShow !== undefined && {
          is_show: productOption.isShow,
        }),
        ...(productOption.search && { search: productOption.search }),
        updated_at: new Date(),
      },
      include: {
        variants: true,
      },
    });
    return this.toProductOptionEntity(updated);
  }

  async deleteProductOption(id: string): Promise<boolean> {
    await this.prismaService.productOption.delete({
      where: { option_id: id },
    });
    return true;
  }

  // ==================== Bulk ProductOption Operations ====================

  async createBulkProductOptions(
    productOptions: ProductOptionEntity[],
  ): Promise<ProductOptionEntity[]> {
    const created = await Promise.all(
      productOptions.map((option) =>
        this.prismaService.productOption.create({
          data: {
            option_id: option.optionId,
            product_id: option.productId,
            name: option.name,
            slug: option.slug,
            color: option.color,
            color_family: option.colorFamily,
            images: option.images,
            price: option.price,
            new_price: option.newPrice,
            out_of_stock: option.outOfStock,
            is_show: option.isShow,
            search: option.search,
            created_at: option.createdAt,
            updated_at: option.updatedAt,
          },
          include: {
            variants: true,
          },
        }),
      ),
    );
    return created.map((option) => this.toProductOptionEntity(option));
  }

  async updateBulkProductOptions(
    options: Array<Partial<ProductOptionEntity> & { optionId: string }>,
  ): Promise<ProductOptionEntity[]> {
    const updated = await Promise.all(
      options.map((option) =>
        this.prismaService.productOption.update({
          where: { option_id: option.optionId },
          data: {
            ...(option.name && { name: option.name }),
            ...(option.slug && { slug: option.slug }),
            ...(option.color && { color: option.color }),
            ...(option.colorFamily && { color_family: option.colorFamily }),
            ...(option.images && { images: option.images }),
            ...(option.price !== undefined && { price: option.price }),
            ...(option.newPrice !== undefined && {
              new_price: option.newPrice,
            }),
            ...(option.outOfStock !== undefined && {
              out_of_stock: option.outOfStock,
            }),
            ...(option.isShow !== undefined && { is_show: option.isShow }),
            ...(option.search && { search: option.search }),
            updated_at: new Date(),
          },
          include: {
            variants: true,
          },
        }),
      ),
    );
    return updated.map((option) => this.toProductOptionEntity(option));
  }

  async deleteBulkProductOptions(optionIds: string[]): Promise<boolean> {
    await this.prismaService.productOption.deleteMany({
      where: {
        option_id: {
          in: optionIds,
        },
      },
    });
    return true;
  }

  // ==================== ProductVariant Operations ====================

  async findProductVariantByIds(
    ids: string[],
  ): Promise<ProductVariantEntity[] | null> {
    const variants = await this.prismaService.productVariant.findMany({
      where: {
        variant_id: {
          in: ids,
        },
      },
    });
    if (variants.length === 0) {
      return null;
    }
    if (variants.length !== ids.length) {
      this.logger.warn(
        `Some ProductVariants not found for IDs: ${ids.join(', ')}`,
      );
    }
    return variants.map((variant) => this.toProductVariantEntity(variant));
  }

  async findVariantsByOptionId(
    optionId: string,
  ): Promise<ProductVariantEntity[]> {
    const variants = await this.prismaService.productVariant.findMany({
      where: { option_id: optionId },
    });
    return variants.map((variant) => this.toProductVariantEntity(variant));
  }

  async createBulkProductVariants(
    variants: ProductVariantEntity[],
  ): Promise<any> {
    const created = await this.prismaService.productVariant.createMany({
      data: variants.map((variant) => ({
        variant_id: variant.variantId,
        option_id: variant.optionId,
        sku: variant.sku,
        size: variant.size,
        price: variant.price,
        new_price: variant.newPrice,
        stock_quantity: variant.stockQuantity,
        created_at: variant.createdAt,
        updated_at: variant.updatedAt,
      })),
    });
    return created;
  }

  async updateBulkProductVariants(
    variants: Array<Partial<IVariantStockPrice> & { variantId: string }>,
  ): Promise<any> {
    const updated = await Promise.all(
      variants.map((variant) =>
        this.prismaService.productVariant.update({
          where: { variant_id: variant.variantId },
          data: {
            ...(variant.price !== undefined && { price: variant.price }),
            ...(variant.newPrice !== undefined && {
              new_price: variant.newPrice,
            }),
            ...(variant.stockQuantity !== undefined && {
              stock_quantity: variant.stockQuantity,
            }),
            updated_at: new Date(),
          },
        }),
      ),
    );
    return updated;
  }

  async deleteBulkProductVariants(variantIds: string[]): Promise<boolean> {
    await this.prismaService.productVariant.deleteMany({
      where: {
        variant_id: {
          in: variantIds,
        },
      },
    });
    return true;
  }

  // ==================== Sync Operations ====================

  async syncProductOptionPricing(optionId: string): Promise<void> {
    const variants = await this.prismaService.productVariant.findMany({
      where: { option_id: optionId },
    });

    if (variants.length === 0) {
      // No variants left - mark as out of stock
      await this.prismaService.productOption.update({
        where: { option_id: optionId },
        data: {
          price: 0,
          new_price: null,
          out_of_stock: true,
          updated_at: new Date(),
        },
      });
      return;
    }

    const minPrice = Math.min(...variants.map((v) => v.price));
    const newPrices = variants
      .map((v) => v.new_price)
      .filter((p): p is number => p !== null);
    const minNewPrice = newPrices.length > 0 ? Math.min(...newPrices) : null;
    const allOutOfStock = variants.every((v) => v.stock_quantity === 0);

    await this.prismaService.productOption.update({
      where: { option_id: optionId },
      data: {
        price: minPrice,
        new_price: minNewPrice,
        out_of_stock: allOutOfStock,
        updated_at: new Date(),
      },
    });
  }

  // ==================== Entity Mappers ====================

  private toProductEntity(raw: any): ProductEntity {
    return new ProductEntity(
      raw.product_id,
      raw.category_id,
      raw.name,
      raw.description,
      raw.thumbnail,
      raw.created_at,
      raw.updated_at,
      raw.options?.map((option: any) => this.toProductOptionEntity(option)),
    );
  }

  private toProductOptionEntity(raw: any): ProductOptionEntity {
    return new ProductOptionEntity(
      raw.option_id,
      raw.product_id,
      raw.name,
      raw.slug,
      raw.color,
      raw.color_family,
      raw.images,
      raw.price,
      raw.new_price,
      raw.out_of_stock,
      raw.is_show,
      raw.search,
      raw.created_at,
      raw.updated_at,
      raw.variants?.map((variant: any) => this.toProductVariantEntity(variant)),
    );
  }

  private toProductVariantEntity(raw: any): ProductVariantEntity {
    return new ProductVariantEntity(
      raw.variant_id,
      raw.option_id,
      raw.sku,
      raw.size,
      raw.price,
      raw.new_price,
      raw.stock_quantity,
      raw.created_at,
      raw.updated_at,
    );
  }
}
