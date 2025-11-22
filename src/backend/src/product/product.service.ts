import { Inject, Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { IProductRepositoryInterface } from './repositories/product.repository.interface';
import { ProductEntity, ProductOptionEntity, ProductVariantEntity } from './entities';
import { CreateProductDto, UpdateProductDto, GetListProductDto, GetListProductClientDto, GetProductByIdQueryDto, UpdateProductStockPriceDto, ModifyProductVariantStockDto } from './dtos';
import { buildSlug, buildSearchString } from '../shared/helpers';

@Injectable()
export class ProductService {   
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: IProductRepositoryInterface,
  ) {}

  // ==================== Product Operations ====================

  /**
   * Create a new product with options and variants
   */
  async createProduct(dto: CreateProductDto) {
    try {
      // Extract thumbnail from first option's first image
      const thumbnail = dto.options[0]?.thumbnail || dto.options[0]?.images[0] || null;

      // Create product entity
      const productEntity = new ProductEntity(
        randomUUID(),
        dto.categoryId,
        dto.name,
        dto.description ?? null,
        thumbnail,
        new Date(),
        new Date(),
      );

      // Create product
      const createdProduct = await this.productRepository.createProduct(productEntity);

      // Create options with variants
      const optionEntities: ProductOptionEntity[] = [];
      const variantsByOption: Map<string, any[]> = new Map();

      for (const optionDto of dto.options) {
        const optionId = randomUUID();
        const slug = buildSlug(optionDto.name);
        const search = buildSearchString(optionDto.name);

        // Calculate denormalized fields from variants
        const minPrice = Math.min(...optionDto.variants.map((v) => v.price));
        const newPrices = optionDto.variants
          .map((v) => v.newPrice)
          .filter((p): p is number => p !== null);
        const minNewPrice = newPrices.length > 0 ? Math.min(...newPrices) : null;
        const allOutOfStock = optionDto.variants.every((v) => v.stockQuantity === 0);

        const optionEntity = new ProductOptionEntity(
          optionId,
          createdProduct.productId,
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
        const variants = optionDto.variants.map((variantDto) => ({
          variant_id: randomUUID(),
          option_id: optionId,
          sku: variantDto.sku,
          size: variantDto.size,
          price: variantDto.price,
          new_price: variantDto.newPrice ?? null,
          stock_quantity: variantDto.stockQuantity,
          created_at: new Date(),
          updated_at: new Date(),
        }));

        variantsByOption.set(optionId, variants);
      }

      // Bulk create options
      await this.productRepository.createBulkProductOptions(optionEntities);

      // Bulk create all variants
      const allVariants = Array.from(variantsByOption.values()).flat();
      await this.productRepository.createBulkProductVariants(allVariants);

      // Fetch complete product with all relations
      const result = await this.productRepository.findProductById(createdProduct.productId);

      this.logger.log(`Product created: ${createdProduct.productId}`);
      return result?.toJSON();
    } catch (error) {
      this.logger.error(`Failed to create product: ${error.message}`);
      throw new BadRequestException(`Failed to create product: ${error.message}`);
    }
  }

  /**
   * Update product general information
   */
  async updateProduct(productId: string, dto: UpdateProductDto) {
    try {
      // Verify product exists
      const existingProduct = await this.productRepository.findProductById(productId, {
        includeOptions: true,
        includeVariants: true,
      });
      if (!existingProduct) {
        throw new NotFoundException(`Product with id ${productId} not found`);
      }

      // Update root product fields
      if (dto.categoryId || dto.name || dto.description !== undefined) {
        await this.productRepository.updateProduct(productId, {
          categoryId: dto.categoryId,
          name: dto.name,
          description: dto.description,
        });
      }

      // Update existing options
      if (dto.options && dto.options.length > 0) {
        const optionUpdates = dto.options.map((opt) => ({
          optionId: opt.optionId,
          ...(opt.name && { name: opt.name, slug: buildSlug(opt.name) }),
          ...(opt.color && { color: opt.color }),
          ...(opt.colorFamily && { colorFamily: opt.colorFamily }),
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
          const newPrices = optionDto.variants
            .map((v) => v.newPrice)
            .filter((p): p is number => p !== null);
          const minNewPrice = newPrices.length > 0 ? Math.min(...newPrices) : null;
          const allOutOfStock = optionDto.variants.every((v) => v.stockQuantity === 0);

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
            new_price: variantDto.newPrice ?? null,
            stock_quantity: variantDto.stockQuantity,
            created_at: new Date(),
            updated_at: new Date(),
          }));

          variantsByOption.set(optionId, variants);
        }

        await this.productRepository.createBulkProductOptions(newOptionEntities);

        const allVariants = Array.from(variantsByOption.values()).flat();
        await this.productRepository.createBulkProductVariants(allVariants);
      }

      // Delete options
      if (dto.deleteOptionIds && dto.deleteOptionIds.length > 0) {
        await this.productRepository.deleteBulkProductOptions(dto.deleteOptionIds);
      }

      // Update product thumbnail if needed
      const updatedProduct = await this.productRepository.findProductById(productId, {
        includeOptions: true,
        includeVariants: false,
      });
      if (updatedProduct && updatedProduct.options && updatedProduct.options.length > 0) {
        const firstOption = updatedProduct.options[0];
        const newThumbnail = firstOption.getThumbnail();
        if (newThumbnail !== updatedProduct.thumbnail) {
          await this.productRepository.updateProduct(productId, {
            thumbnail: newThumbnail,
          });
        }
      }

      // Fetch complete updated product
      const result = await this.productRepository.findProductById(productId);

      this.logger.log(`Product updated: ${productId}`);
      return result?.toJSON();
    } catch (error) {
      this.logger.error(`Failed to update product: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update product: ${error.message}`);
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string, query: GetProductByIdQueryDto) {
    try {
      const product = await this.productRepository.findProductById(id, {
        includeOptions: query.includeOptions,
        includeVariants: query.includeVariants,
      });
      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }
      return product.toJSON();
    } catch (error) {
      this.logger.error(`Failed to get product by id ${id}: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to get product by id ${id}: ${error.message}`);
    }
  }

  /**
   * Get all products with filtering
   */
  async getAllProducts(query: GetListProductDto) {
    try {
      query.limit += 1;
      const products = await this.productRepository.findAllProduct(query, {
        includeOptions: false,
        includeVariants: false,
      });
      const nextCursor = products.length === query.limit
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
      this.logger.error(`Failed to get products: ${error.message}`);
      throw new BadRequestException(`Failed to get products: ${error.message}`);
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string) {
    try {
      const product = await this.productRepository.findProductById(id, {
        includeOptions: false,
        includeVariants: false,
      });
      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      await this.productRepository.deleteProduct(id);
      this.logger.log(`Product deleted: ${id}`);
      return { message: 'Product deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete product: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete product: ${error.message}`);
    }
  }

  /**
   * Update product variants stock and price in bulk
   */
  async updateProductStockPrice(productId: string, dto: UpdateProductStockPriceDto) {
    try {
      // Verify product exists
      const existingProduct = await this.productRepository.findProductById(productId, {
        includeOptions: true,
        includeVariants: true,
      });
      if (!existingProduct) {
        throw new NotFoundException(`Product with id ${productId} not found`);
      }

      // Verify all variants belong to this product
      const variantIds = dto.variants.map((v) => v.variantId);
      const allVariantIds = existingProduct.options
        ?.flatMap((opt) => opt.variants?.map((v) => v.variantId) || []) || [];

      const invalidVariantIds = variantIds.filter((id) => !allVariantIds.includes(id));
      if (invalidVariantIds.length > 0) {
        throw new BadRequestException(
          `Invalid variant IDs: ${invalidVariantIds.join(', ')} do not belong to product ${productId}`,
        );
      }

      // Bulk update variants
      const variantUpdates = dto.variants.map((v) => ({
        variant_id: v.variantId,
        ...(v.price !== undefined && { price: v.price }),
        ...(v.newPrice !== undefined && { new_price: v.newPrice }),
        ...(v.stockQuantity !== undefined && { stock_quantity: v.stockQuantity }),
      }));

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
      this.logger.error(`Failed to update product stock and price: ${error.message}`);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update product stock and price: ${error.message}`);
    }
  }

  async modifyProductVariantStock(body: ModifyProductVariantStockDto) {
    try {
      // Verify variant exists
      const variants = await this.productRepository.findProductVariantByIds(body.variants.map(v => v.variantId));
      if (!variants) {
        throw new NotFoundException(`Some product variants are not found`);
      }

      // Prepare stock modifications
      const stockModifications = body.variants.map(v => ({
        variantId: v.variantId,
        stockQuantity: variants.find(variant => variant.variantId === v.variantId)?.stockQuantity || 0,
        stockChange: v.stockChange,
      }));

      stockModifications.forEach(mod => {
        const newStock = mod.stockQuantity + mod.stockChange;
        if (newStock < 0) {
          throw new BadRequestException(`Insufficient stock for variant ID ${mod.variantId}`);
        }
      });
      
      // Apply stock modifications
      const variantUpdates = body.variants.map((v) => ({
        variant_id: v.variantId,
        stock_quantity: variants.find(variant => variant.variantId === v.variantId)!.stockQuantity + v.stockChange,
      }));

      await this.productRepository.updateBulkProductVariants(variantUpdates);

      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to modify product variant stock: ${error.message}`);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to modify product variant stock: ${error.message}`);
    }
  }

  // ==================== ProductOption Operations ====================

  /**
   * Get all product options with filtering
   */
  async getAllProductOptions(query: GetListProductClientDto) {
    try {
      const options = await this.productRepository.findAllProductOption(query);
      return options.map((option) => option.toJSON());
    } catch (error) {
      this.logger.error(`Failed to get product options: ${error.message}`);
      throw new BadRequestException(`Failed to get product options: ${error.message}`);
    }
  }

  /**
   * Get product option by ID
   */
  async getProductOptionById(id: string) {
    try {
      const option = await this.productRepository.findProductOptionById(id, {
        includeVariants: true,
      });
      if (!option) {
        throw new NotFoundException(`Product option with id ${id} not found`);
      }
      return option.toJSON();
    } catch (error) {
      this.logger.error(`Failed to get product option by id ${id}: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to get product option by id ${id}: ${error.message}`);
    }
  }
}
