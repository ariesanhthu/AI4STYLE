import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { IProductJoinOptions, IProductOptionJoinOptions, IProductRepository, IVariantStockPrice } from '@/core/product/interfaces';
import { GetListProductClientDto, GetListProductDto, ProductOptionResponseDto } from '@/application/product/dtos';
import { ProductEntity, ProductOptionEntity, ProductVariantEntity } from '@/core/product/entities';
export declare class PrismaProductRepository implements IProductRepository {
    private readonly prismaService;
    private readonly logger;
    constructor(prismaService: PrismaService);
    findAll(query: GetListProductDto, options?: IProductJoinOptions): Promise<ProductEntity[]>;
    findById(id: string, options?: IProductJoinOptions): Promise<ProductEntity | null>;
    create(product: ProductEntity): Promise<ProductEntity>;
    update(id: string, product: Partial<ProductEntity>): Promise<ProductEntity | null>;
    delete(id: string): Promise<boolean>;
    findAllOptions(query: GetListProductClientDto, options?: IProductOptionJoinOptions): Promise<ProductOptionEntity[]>;
    findOptionById(id: string, options?: IProductOptionJoinOptions): Promise<ProductOptionResponseDto | null>;
    createOption(productOption: ProductOptionEntity): Promise<ProductOptionEntity>;
    updateOption(id: string, productOption: Partial<ProductOptionEntity>): Promise<ProductOptionEntity | null>;
    deleteOption(id: string): Promise<boolean>;
    createBulkProductOptions(productOptions: ProductOptionEntity[]): Promise<ProductOptionEntity[]>;
    updateBulkProductOptions(options: Array<Partial<ProductOptionEntity> & {
        optionId: string;
    }>): Promise<ProductOptionEntity[]>;
    deleteBulkProductOptions(optionIds: string[]): Promise<boolean>;
    findProductVariantByIds(ids: string[]): Promise<ProductVariantEntity[] | null>;
    findVariantsByOptionId(optionId: string): Promise<ProductVariantEntity[]>;
    createBulkProductVariants(variants: ProductVariantEntity[]): Promise<any>;
    updateBulkProductVariants(variants: Array<Partial<IVariantStockPrice> & {
        variantId: string;
    }>): Promise<any>;
    deleteBulkProductVariants(variantIds: string[]): Promise<boolean>;
    syncProductOptionPricing(optionId: string): Promise<void>;
    getBestSellers(query: Record<string, any>): Promise<any[]>;
    updateBestSellers(data: {
        optionId: string;
        totalSold: number;
    }[]): Promise<void>;
    private getCategoryFamilyIds;
    private toProductEntity;
    private toProductOptionEntity;
    private toProductVariantEntity;
}
