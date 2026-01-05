import { randomUUID } from 'crypto';
import {
  ProductEntity,
  ProductOptionEntity,
  ProductVariantEntity,
} from '@/core/product/entities';
import {
  CreateProductDto,
  UpdateProductDto,
  GetListProductDto,
  GetListProductClientDto,
  GetProductByIdQueryDto,
  UpdateProductStockPriceDto,
  ModifyProductVariantStockDto,
  GetBestSellerDto,
} from '../dtos';
import { buildSlug, buildSearchString } from '@/shared/helpers';
import { type IProductRepository } from '@/core/product/interfaces';
import { ILoggerService } from '@/shared/interfaces';
import {
  InsufficientInventoryException,
  ProductCreationException,
  ProductDeletionException,
  ProductNotFoundException,
  ProductOptionNotFoundException,
  ProductUpdateException,
  ProductVariantNotFoundException,
} from '@/core/product/exceptions';
import { IUnitOfWork } from '@/application/shared';
import { ESortOrder } from '@/shared/enums';

export class ProductService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly logger: ILoggerService,
    private readonly uow: IUnitOfWork,
  ) {
    this.logger.setContext(ProductService.name);
  }

  // ==================== Product Operations ====================

  /**
   * Create a new product with options and variants
   */
  async createProduct(dto: CreateProductDto) {
    try {
      // Extract thumbnail from first option's first image
      const thumbnail =
        dto.options[0]?.thumbnail || dto.options[0]?.images[0] || null;

      // Create product entity
      const productEntity = new ProductEntity(
        randomUUID(),
        dto.categoryId,
        dto.name,
        dto.description ?? null,
        thumbnail,
        buildSearchString(dto.name, dto.description ?? ''),
        new Date(),
        new Date(),
      );


      // Create options with variants
      const optionEntities: ProductOptionEntity[] = [];
      const variantsByOption: Map<string, any[]> = new Map();

      for (const optionDto of dto.options) {
        const optionId = randomUUID();
        const slug = buildSlug(optionDto.name);
        const search = buildSearchString(optionDto.name);

        // Calculate denormalized fields from variants
        const minPrice = Math.min(...optionDto.variants.map((v) => v.price));
        // If newPrice is null, use price (no discount) for calculation purposes
        const newPrices = optionDto.variants.map(
          (v) => v.newPrice ?? v.price,
        );
        const minNewPrice =
          newPrices.length > 0 ? Math.min(...newPrices) : minPrice;
        const allOutOfStock = optionDto.variants.every(
          (v) => v.stockQuantity === 0,
        );

        const optionEntity = new ProductOptionEntity(
          optionId,
          productEntity.productId,
          optionDto.name,
          slug,
          optionDto.color,
          optionDto.colorFamily,
          optionDto.images,
          minPrice,
          minNewPrice,
          allOutOfStock,
          optionDto.isShow,
          search,
          new Date(),
          new Date(),
        );

        optionEntities.push(optionEntity);

        // Prepare variants for this option
        const variants = optionDto.variants.map(
          (variantDto) =>
            new ProductVariantEntity(
              randomUUID(),
              optionId,
              variantDto.sku,
              variantDto.size,
              variantDto.price,
              variantDto.newPrice ?? variantDto.price,
              variantDto.stockQuantity,
              new Date(),
              new Date(),
            ),
        );

        variantsByOption.set(optionId, variants);
      }
      const session = await this.uow.start();
      try {
        // Create product
        await session.productRepository.create(productEntity);

        // Bulk create options
        await session.productRepository.createBulkProductOptions(optionEntities);

        // Bulk create all variants
        const allVariants = Array.from(variantsByOption.values()).flat();
        await session.productRepository.createBulkProductVariants(allVariants);
        session.commit();
      } catch (error) {
        await session.rollback();
        throw error;
      } finally {
        await session.end();
      }

      // Fetch complete product with all relations
      const result = await this.productRepository.findById(
        productEntity.productId,
      );

      this.logger.log(`Product created: ${productEntity.productId}`);
      return result?.toJSON();
    } catch (error) {
      this.logger.error(
        `Failed to create product: ${error.message}`,
        error.stack,
      );
      throw new ProductCreationException(error.message);
    }
  }

  /**
   * Update product general information
   */
  async updateProduct(productId: string, dto: UpdateProductDto) {
    try {
      // Verify product exists
      const existingProduct = await this.productRepository.findById(
        productId,
        {
          includeOptions: true,
          includeVariants: true,
        },
      );
      if (!existingProduct) {
        throw new ProductNotFoundException(productId);
      }

      // Update root product fields
      if (dto.categoryId || dto.name || dto.description !== undefined) {
        await this.productRepository.update(productId, {
          categoryId: dto.categoryId,
          name: dto.name,
          description: dto.description,
          search: buildSearchString(
            dto.name ?? existingProduct.name,
            dto.description ?? existingProduct.description ?? '',
          ),
        });
      }

      // Update existing options
      if (dto.options && dto.options.length > 0) {
        const optionUpdates = dto.options.map((opt) => ({
          optionId: opt.optionId,
          ...(opt.name && { name: opt.name, slug: buildSlug(opt.name) }),
          ...(opt.color && { color: opt.color }),
          ...(opt.colorFamily && { colorFamily: opt.colorFamily }),
          ...(opt.name && { search: buildSearchString(opt.name) }),
          ...(opt.thumbnail && { thumbnail: opt.thumbnail }),
          ...(opt.images && { images: opt.images }),
          ...(opt.isShow !== undefined && { isShow: opt.isShow }),
        }));

        await this.productRepository.updateBulkProductOptions(optionUpdates);
      }

      // Create new options
      if (dto.newOptions && dto.newOptions.length > 0) {
        const newOptionEntities: ProductOptionEntity[] = [];
        const variantsByOption: Map<string, any[]> = new Map();

        for (const optionDto of dto.newOptions) {
          const optionId = randomUUID();
          const slug = buildSlug(optionDto.name);
          const search = buildSearchString(optionDto.name);

          // Calculate denormalized fields
          const minPrice = Math.min(...optionDto.variants.map((v) => v.price));
          const newPrices = optionDto.variants.map(
            (v) => v.newPrice ?? v.price,
          );
          const minNewPrice =
            newPrices.length > 0 ? Math.min(...newPrices) : minPrice;
          const allOutOfStock = optionDto.variants.every(
            (v) => v.stockQuantity === 0,
          );

          const optionEntity = new ProductOptionEntity(
            optionId,
            productId,
            optionDto.name,
            slug,
            optionDto.color,
            optionDto.colorFamily,
            optionDto.images,
            minPrice,
            minNewPrice,
            allOutOfStock,
            optionDto.isShow,
            search,
            new Date(),
            new Date(),
          );

          newOptionEntities.push(optionEntity);

          // Prepare variants
          const variants = optionDto.variants.map((variantDto) => ({
            variant_id: randomUUID(),
            option_id: optionId,
            sku: variantDto.sku,
            size: variantDto.size,
            price: variantDto.price,
            new_price: variantDto.newPrice ?? variantDto.price,
            stock_quantity: variantDto.stockQuantity,
            created_at: new Date(),
            updated_at: new Date(),
          }));

          variantsByOption.set(optionId, variants);
        }

        await this.productRepository.createBulkProductOptions(
          newOptionEntities,
        );

        const allVariants = Array.from(variantsByOption.values()).flat();
        await this.productRepository.createBulkProductVariants(allVariants);
      }

      // Delete options
      if (dto.deleteOptionIds && dto.deleteOptionIds.length > 0) {
        await this.productRepository.deleteBulkProductOptions(
          dto.deleteOptionIds,
        );
      }

      // Update product thumbnail if needed
      const updatedProduct = await this.productRepository.findById(
        productId,
        {
          includeOptions: true,
          includeVariants: false,
        },
      );
      if (
        updatedProduct &&
        updatedProduct.options &&
        updatedProduct.options.length > 0
      ) {
        const firstOption = updatedProduct.options[0];
        const newThumbnail = firstOption.getThumbnail();
        if (newThumbnail !== updatedProduct.thumbnail) {
          await this.productRepository.update(productId, {
            thumbnail: newThumbnail,
          });
        }
      }

      // Fetch complete updated product
      const result = await this.productRepository.findById(productId);

      this.logger.log(`Product updated: ${productId}`);
      return result?.toJSON();
    } catch (error) {
      this.logger.error(
        `Failed to update product: ${error.message}`,
        error.stack,
      );
      if (error instanceof ProductNotFoundException) {
        throw error;
      }
      throw new ProductUpdateException(error.message);
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string, query: GetProductByIdQueryDto) {
    try {
      const product = await this.productRepository.findById(id, {
        includeOptions: query.includeOptions,
        includeVariants: query.includeVariants,
      });
      if (!product) {
        throw new ProductNotFoundException(id);
      }
      return product.toJSON();
    } catch (error) {
      this.logger.error(
        `Failed to get product by id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get all products with filtering
   */
  async getAllProducts(query: GetListProductDto) {
    try {
      if (query.search) {
        query.search = buildSearchString(query.search);
      }
      if (!query.limit) query.limit = 10;
      if (!query.sortOrder) query.sortOrder = ESortOrder.DESC;
      query.limit += 1;
      const products = await this.productRepository.findAll(query, {
        includeOptions: false,
        includeVariants: false,
      });
      const nextCursor =
        products.length === query.limit
          ? products[products.length - 1].productId
          : null;
      if (nextCursor) {
        products.pop();
      }
      return {
        items: products.map((product) => product.toJSON()),
        nextCursor,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get products: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string) {
    try {
      const product = await this.productRepository.findById(id, {
        includeOptions: false,
        includeVariants: false,
      });
      if (!product) {
        throw new ProductNotFoundException(id);
      }

      await this.productRepository.delete(id);
      this.logger.log(`Product deleted: ${id}`);
      return { message: 'Product deleted successfully' };
    } catch (error) {
      this.logger.error(
        `Failed to delete product: ${error.message}`,
        error.stack,
      );
      if (error instanceof ProductNotFoundException) {
        throw error;
      }
      throw new ProductDeletionException(error.message);
    }
  }

  /**
   * Update product variants stock and price in bulk
   */
  async updateProductStockPrice(
    productId: string,
    dto: UpdateProductStockPriceDto,
  ) {
    try {
      // Verify product exists
      const existingProduct = await this.productRepository.findById(
        productId,
        {
          includeOptions: true,
          includeVariants: true,
        },
      );
      if (!existingProduct) {
        throw new ProductNotFoundException(productId);
      }

      // Verify all variants belong to this product
      const variantIds = dto.variants.map((v) => v.variantId);
      const allVariantIds =
        existingProduct.options?.flatMap(
          (opt) => opt.variants?.map((v) => v.variantId) || [],
        ) || [];

      const invalidVariantIds = variantIds.filter(
        (id) => !allVariantIds.includes(id),
      );
      if (invalidVariantIds.length > 0) {
        throw new ProductUpdateException(
          `Invalid variant IDs: ${invalidVariantIds.join(', ')} do not belong to product ${productId}`,
        );
      }

      // Bulk update variants
      const variantUpdates = dto.variants.map((v) => {
        let newPriceUpdate: number | undefined;

        if (v.newPrice !== undefined) {
          if (v.newPrice === null) {
            // Logic: Removing discount means setting newPrice = price.
            // We need to know the effective price for this update.
            // Use provided v.price if present, else lookup existing price.
            if (v.price !== undefined) {
              newPriceUpdate = v.price;
            } else {
              const existingVariant = allVariantIds.includes(v.variantId)
                ? existingProduct.options
                  ?.flatMap((o) => o.variants || [])
                  .find((ev) => ev.variantId === v.variantId)
                : null;
              newPriceUpdate = existingVariant?.price;
            }
          } else {
            newPriceUpdate = v.newPrice;
          }
        }

        return {
          variantId: v.variantId,
          ...(v.price !== undefined && { price: v.price }),
          ...(newPriceUpdate !== undefined && { newPrice: newPriceUpdate }),
          ...(v.stockQuantity !== undefined && {
            stockQuantity: v.stockQuantity,
          }),
        };
      });

      await this.productRepository.updateBulkProductVariants(variantUpdates);

      // Get all affected option IDs
      const affectedOptionIds = new Set<string>();
      for (const variantId of variantIds) {
        const option = existingProduct.options?.find((opt) =>
          opt.variants?.some((v) => v.variantId === variantId),
        );
        if (option) {
          affectedOptionIds.add(option.optionId);
        }
      }

      // Sync denormalized fields for affected options
      for (const optionId of Array.from(affectedOptionIds)) {
        await this.productRepository.syncProductOptionPricing(optionId);
      }

      this.logger.log(`Product stock and price updated: ${productId}`);
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Failed to update product stock and price: ${error.message}`,
        error.stack,
      );
      if (error instanceof ProductNotFoundException) {
        throw error;
      }
      throw new ProductUpdateException(error.message);
    }
  }

  async modifyProductVariantStock(body: ModifyProductVariantStockDto) {
    try {
      // Verify variant exists
      const variants = await this.productRepository.findProductVariantByIds(
        body.variants.map((v) => v.variantId),
      );
      if (!variants) {
        throw new ProductVariantNotFoundException('Some variants');
      }

      // Prepare stock modifications
      const stockModifications = body.variants.map((v) => ({
        variantId: v.variantId,
        stockQuantity:
          variants.find((variant) => variant.variantId === v.variantId)
            ?.stockQuantity || 0,
        stockChange: v.stockChange,
      }));

      stockModifications.forEach((mod) => {
        const newStock = mod.stockQuantity + mod.stockChange;
        if (newStock < 0) {
          throw new InsufficientInventoryException(mod.variantId);
        }
      });

      // Apply stock modifications
      const variantUpdates = body.variants.map((v) => ({
        variantId: v.variantId,
        stockQuantity:
          variants.find((variant) => variant.variantId === v.variantId)!
            .stockQuantity + v.stockChange,
      }));

      await this.productRepository.updateBulkProductVariants(variantUpdates);

      return { success: true };
    } catch (error) {
      this.logger.error(
        `Failed to modify product variant stock: ${error.message}`,
        error.stack,
      );
      if (
        error instanceof ProductVariantNotFoundException ||
        error instanceof InsufficientInventoryException
      ) {
        throw error;
      }
      throw new ProductUpdateException(error.message);
    }
  }

  // ==================== ProductOption Operations ====================

  /**
   * Get all product options with filtering
   */
  async getAllProductOptions(query: GetListProductClientDto) {
    try {
      if (query.search) {
        query.search = buildSearchString(query.search);
      }
      if (!query.limit) query.limit = 10;
      if (!query.sortOrder) query.sortOrder = ESortOrder.DESC;
      query.limit += 1;
      const options = await this.productRepository.findAllOptions(query);
      const nextCursor =
        options.length === query.limit
          ? options[options.length - 1].optionId
          : null;
      if (nextCursor) {
        options.pop();
      }
      return {
        items: options.map((option) => option.toJSON()),
        nextCursor,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get product options: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get product option by ID
   */
  async getProductOptionById(id: string) {
    try {
      const option = await this.productRepository.findOptionById(id, {
        includeVariants: true,
      });
      if (!option) {
        throw new ProductOptionNotFoundException(id);
      }
      return option;
    } catch (error) {
      this.logger.error(
        `Failed to get product option by id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
  /**
   * Get best seller products
   */
  async getBestSellers(query: GetBestSellerDto) {
    try {
      // Fetch one more item to determine next cursor
      const limit = query.limit || 10;
      const bestSellers = await this.productRepository.getBestSellers({
        ...query,
        limit: limit + 1,
      });

      let nextCursor: string | null = null;
      if (bestSellers.length > limit) {
        bestSellers.pop(); // Remove the extra item
        const lastItem = bestSellers[bestSellers.length - 1];
        nextCursor = `${lastItem.totalSold}:${lastItem.optionId}`;
      }

      return {
        items: bestSellers.map((item) => ({
          ...item.entity.toJSON(),
          totalSold: item.totalSold,
        })),
        nextCursor,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get best sellers: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
