import { ProductEntity, ProductOptionEntity, ProductVariantEntity } from '../entities';
import { IVariantStockPrice } from './variant-stock-price.interface';
export interface IProductJoinOptions {
    includeOptions?: boolean;
    includeVariants?: boolean;
}
export interface IProductOptionJoinOptions {
    includeVariants?: boolean;
}
export interface IProductRepository {
    findAll(query: Record<string, any>, options?: IProductJoinOptions): Promise<ProductEntity[]>;
    findById(id: string, options?: IProductJoinOptions): Promise<ProductEntity | null>;
    create(product: ProductEntity): Promise<ProductEntity>;
    update(id: string, product: Partial<ProductEntity>): Promise<ProductEntity | null>;
    delete(id: string): Promise<boolean>;
    findAllOptions(query: Record<string, any>, options?: IProductOptionJoinOptions): Promise<ProductOptionEntity[]>;
    findOptionById(id: string, options?: IProductOptionJoinOptions): Promise<unknown | null>;
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
    updateBulkProductVariants(variants: IVariantStockPrice[]): Promise<any>;
    deleteBulkProductVariants(variantIds: string[]): Promise<boolean>;
    syncProductOptionPricing(optionId: string): Promise<void>;
    getBestSellers(query: Record<string, any>): Promise<any[]>;
    updateBestSellers(data: {
        optionId: string;
        totalSold: number;
    }[]): Promise<void>;
}
export declare const PRODUCT_REPOSITORY: unique symbol;
