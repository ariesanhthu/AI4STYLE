"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PrismaProductRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaProductRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const dtos_1 = require("../../../application/product/dtos");
const entities_1 = require("../../../core/product/entities");
let PrismaProductRepository = PrismaProductRepository_1 = class PrismaProductRepository {
    prismaService;
    logger = new common_1.Logger(PrismaProductRepository_1.name);
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async findAll(query, options) {
        const whereClause = {};
        if (query.category_id) {
            const categoryIds = await this.getCategoryFamilyIds(query.category_id);
            whereClause.category_id = { in: categoryIds };
        }
        if (query.is_show !== undefined) {
            whereClause.options = {
                some: {
                    is_show: query.is_show,
                },
            };
        }
        if (query.search) {
            whereClause.search = {
                contains: query.search,
                mode: 'insensitive',
            };
        }
        const optionsWhere = {};
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
        const includeClause = {};
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
            orderBy: { updated_at: query.sortOrder || 'desc' },
            where: whereClause,
            include: includeClause,
        });
        return products.map((product) => this.toProductEntity(product));
    }
    async findById(id, options) {
        console.log('options', options);
        const includeClause = {};
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
    async create(product) {
        const created = await this.prismaService.product.create({
            data: {
                product_id: product.productId,
                category_id: product.categoryId,
                name: product.name,
                description: product.description,
                thumbnail: product.thumbnail,
                search: product.search,
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
    async update(id, product) {
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
                ...(product.search && { search: product.search }),
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
    async delete(id) {
        await this.prismaService.product.delete({
            where: { product_id: id },
        });
        return true;
    }
    async findAllOptions(query, options) {
        const whereClause = {};
        if (query.category_id) {
            const categoryIds = await this.getCategoryFamilyIds(query.category_id);
            whereClause.product = { category_id: { in: categoryIds } };
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
        let orderByClause = {};
        switch (query.sortOption) {
            case dtos_1.EProductSortOption.PRICE:
                orderByClause = { new_price: query.sortOrder || 'desc' };
                break;
            case dtos_1.EProductSortOption.TIME:
                orderByClause = { updated_at: query.sortOrder || 'desc' };
                break;
            default:
                orderByClause = { updated_at: 'desc' };
        }
        const productOptions = await this.prismaService.productOption.findMany({
            take: query.limit,
            skip: query.cursor ? 1 : 0,
            cursor: query.cursor ? { option_id: query.cursor } : undefined,
            orderBy: orderByClause,
            where: whereClause,
            include: {
                variants: options?.includeVariants === true,
            },
        });
        return productOptions.map((option) => this.toProductOptionEntity(option));
    }
    async findOptionById(id, options) {
        const option = await this.prismaService.productOption.findUnique({
            where: { option_id: id },
            include: {
                variants: options?.includeVariants === true,
            },
        });
        if (!option) {
            return null;
        }
        const relatedOption = await this.prismaService.productOption.findMany({
            where: { product_id: option.product_id },
            select: {
                images: true,
                option_id: true,
                slug: true
            }
        });
        const data = this.toProductOptionEntity(option).toJSON();
        return {
            optionId: data.optionId,
            productId: data.productId,
            name: data.name,
            slug: data.slug,
            color: data.color,
            colorFamily: data.colorFamily,
            thumbnail: data.thumbnail,
            images: data.images,
            price: data.price,
            newPrice: data.newPrice,
            outOfStock: data.outOfStock,
            isShow: data.isShow,
            createdAt: data.createdAt.toISOString(),
            updatedAt: data.updatedAt.toISOString(),
            hasDiscount: data.hasDiscount,
            discountPercentage: data.discountPercentage,
            variants: data.variants?.map((variant) => ({
                ...variant,
                createdAt: variant.createdAt.toISOString(),
                updatedAt: variant.updatedAt.toISOString(),
            })),
            relatedOptions: relatedOption?.map((option) => ({
                optionId: option.option_id,
                slug: option.slug,
                thumbnail: option.images[0]
            }))
        };
    }
    async createOption(productOption) {
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
                new_price: productOption.newPrice ?? productOption.price,
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
    async updateOption(id, productOption) {
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
    async deleteOption(id) {
        await this.prismaService.productOption.delete({
            where: { option_id: id },
        });
        return true;
    }
    async createBulkProductOptions(productOptions) {
        const created = await Promise.all(productOptions.map((option) => this.prismaService.productOption.create({
            data: {
                option_id: option.optionId,
                product_id: option.productId,
                name: option.name,
                slug: option.slug,
                color: option.color,
                color_family: option.colorFamily,
                images: option.images,
                price: option.price,
                new_price: option.newPrice ?? option.price,
                out_of_stock: option.outOfStock,
                is_show: option.isShow,
                search: option.search,
                created_at: option.createdAt,
                updated_at: option.updatedAt,
            },
            include: {
                variants: true,
            },
        })));
        return created.map((option) => this.toProductOptionEntity(option));
    }
    async updateBulkProductOptions(options) {
        const updated = await Promise.all(options.map((option) => this.prismaService.productOption.update({
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
        })));
        return updated.map((option) => this.toProductOptionEntity(option));
    }
    async deleteBulkProductOptions(optionIds) {
        await this.prismaService.productOption.deleteMany({
            where: {
                option_id: {
                    in: optionIds,
                },
            },
        });
        return true;
    }
    async findProductVariantByIds(ids) {
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
            this.logger.warn(`Some ProductVariants not found for IDs: ${ids.join(', ')}`);
        }
        return variants.map((variant) => this.toProductVariantEntity(variant));
    }
    async findVariantsByOptionId(optionId) {
        const variants = await this.prismaService.productVariant.findMany({
            where: { option_id: optionId },
        });
        return variants.map((variant) => this.toProductVariantEntity(variant));
    }
    async createBulkProductVariants(variants) {
        const created = await this.prismaService.productVariant.createMany({
            data: variants.map((variant) => ({
                variant_id: variant.variantId,
                option_id: variant.optionId,
                sku: variant.sku,
                size: variant.size,
                price: variant.price,
                new_price: variant.newPrice ?? variant.price,
                stock_quantity: variant.stockQuantity,
                created_at: variant.createdAt,
                updated_at: variant.updatedAt,
            })),
        });
        return created;
    }
    async updateBulkProductVariants(variants) {
        const updated = await Promise.all(variants.map((variant) => this.prismaService.productVariant.update({
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
        })));
        return updated;
    }
    async deleteBulkProductVariants(variantIds) {
        await this.prismaService.productVariant.deleteMany({
            where: {
                variant_id: {
                    in: variantIds,
                },
            },
        });
        return true;
    }
    async syncProductOptionPricing(optionId) {
        const variants = await this.prismaService.productVariant.findMany({
            where: { option_id: optionId },
        });
        if (variants.length === 0) {
            await this.prismaService.productOption.update({
                where: { option_id: optionId },
                data: {
                    price: 0,
                    new_price: 0,
                    out_of_stock: true,
                    updated_at: new Date(),
                },
            });
            return;
        }
        const minPrice = Math.min(...variants.map((v) => v.price));
        const newPrices = variants.map((v) => v.new_price ?? v.price);
        const minNewPrice = newPrices.length > 0 ? Math.min(...newPrices) : minPrice;
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
    async getBestSellers(query) {
        const { limit = 10, cursor } = query;
        let cursorTotalSold;
        let cursorOptionId;
        if (cursor) {
            const [totalSoldStr, optionId] = cursor.split(':');
            cursorTotalSold = parseInt(totalSoldStr, 10);
            cursorOptionId = optionId;
        }
        const whereClause = {};
        if (cursorTotalSold !== undefined && cursorOptionId) {
            whereClause.OR = [
                { total_sold: { lt: cursorTotalSold } },
                {
                    total_sold: cursorTotalSold,
                    product_option_id: { gt: cursorOptionId },
                },
            ];
        }
        const bestSellers = await this.prismaService.bestSeller.findMany({
            take: limit,
            where: whereClause,
            orderBy: [{ total_sold: 'desc' }, { product_option_id: 'asc' }],
            include: {
                productOption: true,
            },
        });
        return bestSellers.map((item) => ({
            entity: this.toProductOptionEntity(item.productOption),
            totalSold: item.total_sold,
        }));
    }
    async updateBestSellers(data) {
        await this.prismaService.$transaction(async (tx) => {
            for (const item of data) {
                await tx.bestSeller.upsert({
                    where: { product_option_id: item.optionId },
                    update: {
                        total_sold: item.totalSold,
                    },
                    create: {
                        product_option_id: item.optionId,
                        total_sold: item.totalSold,
                    },
                });
            }
        });
    }
    async getCategoryFamilyIds(rootId) {
        const allCategories = await this.prismaService.category.findMany({
            select: { category_id: true, parent_id: true },
        });
        const familyIds = new Set([rootId]);
        const queue = [rootId];
        while (queue.length > 0) {
            const currentId = queue.shift();
            const children = allCategories.filter((c) => c.parent_id === currentId);
            for (const child of children) {
                if (!familyIds.has(child.category_id)) {
                    familyIds.add(child.category_id);
                    queue.push(child.category_id);
                }
            }
        }
        return Array.from(familyIds);
    }
    toProductEntity(raw) {
        return new entities_1.ProductEntity(raw.product_id, raw.category_id, raw.name, raw.description, raw.thumbnail, raw.search, raw.created_at, raw.updated_at, raw.options?.map((option) => this.toProductOptionEntity(option)));
    }
    toProductOptionEntity(raw) {
        return new entities_1.ProductOptionEntity(raw.option_id, raw.product_id, raw.name, raw.slug, raw.color, raw.color_family, raw.images, raw.price, raw.new_price, raw.out_of_stock, raw.is_show, raw.search, raw.created_at, raw.updated_at, raw.variants?.map((variant) => this.toProductVariantEntity(variant)));
    }
    toProductVariantEntity(raw) {
        return new entities_1.ProductVariantEntity(raw.variant_id, raw.option_id, raw.sku, raw.size, raw.price, raw.new_price, raw.stock_quantity, raw.created_at, raw.updated_at);
    }
};
exports.PrismaProductRepository = PrismaProductRepository;
exports.PrismaProductRepository = PrismaProductRepository = PrismaProductRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaProductRepository);
//# sourceMappingURL=prisma-product.repository.js.map