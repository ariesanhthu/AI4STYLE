"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const crypto_1 = require("crypto");
const entities_1 = require("../../../core/product/entities");
const helpers_1 = require("../../../shared/helpers");
const exceptions_1 = require("../../../core/product/exceptions");
const enums_1 = require("../../../shared/enums");
class ProductService {
    productRepository;
    logger;
    uow;
    constructor(productRepository, logger, uow) {
        this.productRepository = productRepository;
        this.logger = logger;
        this.uow = uow;
        this.logger.setContext(ProductService.name);
    }
    async createProduct(dto) {
        try {
            const thumbnail = dto.options[0]?.thumbnail || dto.options[0]?.images[0] || null;
            const productEntity = new entities_1.ProductEntity((0, crypto_1.randomUUID)(), dto.categoryId, dto.name, dto.description ?? null, thumbnail, (0, helpers_1.buildSearchString)(dto.name, dto.description ?? ''), new Date(), new Date());
            const optionEntities = [];
            const variantsByOption = new Map();
            for (const optionDto of dto.options) {
                const optionId = (0, crypto_1.randomUUID)();
                const slug = (0, helpers_1.buildSlug)(optionDto.name);
                const search = (0, helpers_1.buildSearchString)(optionDto.name);
                const minPrice = Math.min(...optionDto.variants.map((v) => v.price));
                const newPrices = optionDto.variants.map((v) => v.newPrice ?? v.price);
                const minNewPrice = newPrices.length > 0 ? Math.min(...newPrices) : minPrice;
                const allOutOfStock = optionDto.variants.every((v) => v.stockQuantity === 0);
                const optionEntity = new entities_1.ProductOptionEntity(optionId, productEntity.productId, optionDto.name, slug, optionDto.color, optionDto.colorFamily, optionDto.images, minPrice, minNewPrice, allOutOfStock, optionDto.isShow, search, new Date(), new Date());
                optionEntities.push(optionEntity);
                const variants = optionDto.variants.map((variantDto) => new entities_1.ProductVariantEntity((0, crypto_1.randomUUID)(), optionId, variantDto.sku, variantDto.size, variantDto.price, variantDto.newPrice ?? variantDto.price, variantDto.stockQuantity, new Date(), new Date()));
                variantsByOption.set(optionId, variants);
            }
            const session = await this.uow.start();
            try {
                await session.productRepository.create(productEntity);
                await session.productRepository.createBulkProductOptions(optionEntities);
                const allVariants = Array.from(variantsByOption.values()).flat();
                await session.productRepository.createBulkProductVariants(allVariants);
                session.commit();
            }
            catch (error) {
                await session.rollback();
                throw error;
            }
            finally {
                await session.end();
            }
            const result = await this.productRepository.findById(productEntity.productId);
            this.logger.log(`Product created: ${productEntity.productId}`);
            return result?.toJSON();
        }
        catch (error) {
            this.logger.error(`Failed to create product: ${error.message}`, error.stack);
            throw new exceptions_1.ProductCreationException(error.message);
        }
    }
    async updateProduct(productId, dto) {
        try {
            const existingProduct = await this.productRepository.findById(productId, {
                includeOptions: true,
                includeVariants: true,
            });
            if (!existingProduct) {
                throw new exceptions_1.ProductNotFoundException(productId);
            }
            if (dto.categoryId || dto.name || dto.description !== undefined) {
                await this.productRepository.update(productId, {
                    categoryId: dto.categoryId,
                    name: dto.name,
                    description: dto.description,
                    search: (0, helpers_1.buildSearchString)(dto.name ?? existingProduct.name, dto.description ?? existingProduct.description ?? ''),
                });
            }
            if (dto.options && dto.options.length > 0) {
                const optionUpdates = dto.options.map((opt) => ({
                    optionId: opt.optionId,
                    ...(opt.name && { name: opt.name, slug: (0, helpers_1.buildSlug)(opt.name) }),
                    ...(opt.color && { color: opt.color }),
                    ...(opt.colorFamily && { colorFamily: opt.colorFamily }),
                    ...(opt.name && { search: (0, helpers_1.buildSearchString)(opt.name) }),
                    ...(opt.thumbnail && { thumbnail: opt.thumbnail }),
                    ...(opt.images && { images: opt.images }),
                    ...(opt.isShow !== undefined && { isShow: opt.isShow }),
                }));
                await this.productRepository.updateBulkProductOptions(optionUpdates);
            }
            if (dto.newOptions && dto.newOptions.length > 0) {
                const newOptionEntities = [];
                const variantsByOption = new Map();
                for (const optionDto of dto.newOptions) {
                    const optionId = (0, crypto_1.randomUUID)();
                    const slug = (0, helpers_1.buildSlug)(optionDto.name);
                    const search = (0, helpers_1.buildSearchString)(optionDto.name);
                    const minPrice = Math.min(...optionDto.variants.map((v) => v.price));
                    const newPrices = optionDto.variants.map((v) => v.newPrice ?? v.price);
                    const minNewPrice = newPrices.length > 0 ? Math.min(...newPrices) : minPrice;
                    const allOutOfStock = optionDto.variants.every((v) => v.stockQuantity === 0);
                    const optionEntity = new entities_1.ProductOptionEntity(optionId, productId, optionDto.name, slug, optionDto.color, optionDto.colorFamily, optionDto.images, minPrice, minNewPrice, allOutOfStock, optionDto.isShow, search, new Date(), new Date());
                    newOptionEntities.push(optionEntity);
                    const variants = optionDto.variants.map((variantDto) => ({
                        variant_id: (0, crypto_1.randomUUID)(),
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
                await this.productRepository.createBulkProductOptions(newOptionEntities);
                const allVariants = Array.from(variantsByOption.values()).flat();
                await this.productRepository.createBulkProductVariants(allVariants);
            }
            if (dto.deleteOptionIds && dto.deleteOptionIds.length > 0) {
                await this.productRepository.deleteBulkProductOptions(dto.deleteOptionIds);
            }
            const updatedProduct = await this.productRepository.findById(productId, {
                includeOptions: true,
                includeVariants: false,
            });
            if (updatedProduct &&
                updatedProduct.options &&
                updatedProduct.options.length > 0) {
                const firstOption = updatedProduct.options[0];
                const newThumbnail = firstOption.getThumbnail();
                if (newThumbnail !== updatedProduct.thumbnail) {
                    await this.productRepository.update(productId, {
                        thumbnail: newThumbnail,
                    });
                }
            }
            const result = await this.productRepository.findById(productId);
            this.logger.log(`Product updated: ${productId}`);
            return result?.toJSON();
        }
        catch (error) {
            this.logger.error(`Failed to update product: ${error.message}`, error.stack);
            if (error instanceof exceptions_1.ProductNotFoundException) {
                throw error;
            }
            throw new exceptions_1.ProductUpdateException(error.message);
        }
    }
    async getProductById(id, query) {
        try {
            const product = await this.productRepository.findById(id, {
                includeOptions: query.includeOptions,
                includeVariants: query.includeVariants,
            });
            if (!product) {
                throw new exceptions_1.ProductNotFoundException(id);
            }
            return product.toJSON();
        }
        catch (error) {
            this.logger.error(`Failed to get product by id ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getAllProducts(query) {
        try {
            if (query.search) {
                query.search = (0, helpers_1.buildSearchString)(query.search);
            }
            if (!query.limit)
                query.limit = 10;
            if (!query.sortOrder)
                query.sortOrder = enums_1.ESortOrder.DESC;
            query.limit += 1;
            const products = await this.productRepository.findAll(query, {
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
        }
        catch (error) {
            this.logger.error(`Failed to get products: ${error.message}`, error.stack);
            throw error;
        }
    }
    async deleteProduct(id) {
        try {
            const product = await this.productRepository.findById(id, {
                includeOptions: false,
                includeVariants: false,
            });
            if (!product) {
                throw new exceptions_1.ProductNotFoundException(id);
            }
            await this.productRepository.delete(id);
            this.logger.log(`Product deleted: ${id}`);
            return { message: 'Product deleted successfully' };
        }
        catch (error) {
            this.logger.error(`Failed to delete product: ${error.message}`, error.stack);
            if (error instanceof exceptions_1.ProductNotFoundException) {
                throw error;
            }
            throw new exceptions_1.ProductDeletionException(error.message);
        }
    }
    async updateProductStockPrice(productId, dto) {
        try {
            const existingProduct = await this.productRepository.findById(productId, {
                includeOptions: true,
                includeVariants: true,
            });
            if (!existingProduct) {
                throw new exceptions_1.ProductNotFoundException(productId);
            }
            const variantIds = dto.variants.map((v) => v.variantId);
            const allVariantIds = existingProduct.options?.flatMap((opt) => opt.variants?.map((v) => v.variantId) || []) || [];
            const invalidVariantIds = variantIds.filter((id) => !allVariantIds.includes(id));
            if (invalidVariantIds.length > 0) {
                throw new exceptions_1.ProductUpdateException(`Invalid variant IDs: ${invalidVariantIds.join(', ')} do not belong to product ${productId}`);
            }
            const variantUpdates = dto.variants.map((v) => {
                let newPriceUpdate;
                if (v.newPrice !== undefined) {
                    if (v.newPrice === null) {
                        if (v.price !== undefined) {
                            newPriceUpdate = v.price;
                        }
                        else {
                            const existingVariant = allVariantIds.includes(v.variantId)
                                ? existingProduct.options
                                    ?.flatMap((o) => o.variants || [])
                                    .find((ev) => ev.variantId === v.variantId)
                                : null;
                            newPriceUpdate = existingVariant?.price;
                        }
                    }
                    else {
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
            const affectedOptionIds = new Set();
            for (const variantId of variantIds) {
                const option = existingProduct.options?.find((opt) => opt.variants?.some((v) => v.variantId === variantId));
                if (option) {
                    affectedOptionIds.add(option.optionId);
                }
            }
            for (const optionId of Array.from(affectedOptionIds)) {
                await this.productRepository.syncProductOptionPricing(optionId);
            }
            this.logger.log(`Product stock and price updated: ${productId}`);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to update product stock and price: ${error.message}`, error.stack);
            if (error instanceof exceptions_1.ProductNotFoundException) {
                throw error;
            }
            throw new exceptions_1.ProductUpdateException(error.message);
        }
    }
    async modifyProductVariantStock(body) {
        try {
            const variants = await this.productRepository.findProductVariantByIds(body.variants.map((v) => v.variantId));
            if (!variants) {
                throw new exceptions_1.ProductVariantNotFoundException('Some variants');
            }
            const stockModifications = body.variants.map((v) => ({
                variantId: v.variantId,
                stockQuantity: variants.find((variant) => variant.variantId === v.variantId)
                    ?.stockQuantity || 0,
                stockChange: v.stockChange,
            }));
            stockModifications.forEach((mod) => {
                const newStock = mod.stockQuantity + mod.stockChange;
                if (newStock < 0) {
                    throw new exceptions_1.InsufficientInventoryException(mod.variantId);
                }
            });
            const variantUpdates = body.variants.map((v) => ({
                variantId: v.variantId,
                stockQuantity: variants.find((variant) => variant.variantId === v.variantId)
                    .stockQuantity + v.stockChange,
            }));
            await this.productRepository.updateBulkProductVariants(variantUpdates);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to modify product variant stock: ${error.message}`, error.stack);
            if (error instanceof exceptions_1.ProductVariantNotFoundException ||
                error instanceof exceptions_1.InsufficientInventoryException) {
                throw error;
            }
            throw new exceptions_1.ProductUpdateException(error.message);
        }
    }
    async getAllProductOptions(query) {
        try {
            if (query.search) {
                query.search = (0, helpers_1.buildSearchString)(query.search);
            }
            if (!query.limit)
                query.limit = 10;
            if (!query.sortOrder)
                query.sortOrder = enums_1.ESortOrder.DESC;
            query.limit += 1;
            const options = await this.productRepository.findAllOptions(query);
            const nextCursor = options.length === query.limit
                ? options[options.length - 1].optionId
                : null;
            if (nextCursor) {
                options.pop();
            }
            return {
                items: options.map((option) => option.toJSON()),
                nextCursor,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get product options: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getProductOptionById(id) {
        try {
            const option = await this.productRepository.findOptionById(id, {
                includeVariants: true,
            });
            if (!option) {
                throw new exceptions_1.ProductOptionNotFoundException(id);
            }
            return option;
        }
        catch (error) {
            this.logger.error(`Failed to get product option by id ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getBestSellers(query) {
        try {
            const limit = query.limit || 10;
            const bestSellers = await this.productRepository.getBestSellers({
                ...query,
                limit: limit + 1,
            });
            let nextCursor = null;
            if (bestSellers.length > limit) {
                bestSellers.pop();
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
        }
        catch (error) {
            this.logger.error(`Failed to get best sellers: ${error.message}`, error.stack);
            throw error;
        }
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map