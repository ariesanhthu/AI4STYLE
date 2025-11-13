import { ProductVariant } from "@prisma/client";
import { GetListProductClientDto, GetListProductDto } from "../dtos";
import { ProductEntity, ProductOptionEntity, ProductVariantEntity } from "../entities";

export interface ProductJoinOptions {
  includeOptions?: boolean;
  includeVariants?: boolean;
}

export interface ProductOptionJoinOptions {
  includeVariants?: boolean;
}

export interface IProductRepositoryInterface {
  // Product operations
  findAllProduct(query: GetListProductDto, options?: ProductJoinOptions): Promise<ProductEntity[]>;
  findProductById(id: string, options?: ProductJoinOptions): Promise<ProductEntity | null>;
  createProduct(product: ProductEntity): Promise<ProductEntity>;
  updateProduct(id: string, product: Partial<ProductEntity>): Promise<ProductEntity | null>;
  deleteProduct(id: string): Promise<boolean>;

  // ProductOption operations
  findAllProductOption(query: GetListProductClientDto, options?: ProductOptionJoinOptions): Promise<ProductOptionEntity[]>;
  findProductOptionById(id: string, options?: ProductOptionJoinOptions): Promise<ProductOptionEntity | null>;
  createProductOption(productOption: ProductOptionEntity): Promise<ProductOptionEntity>;
  updateProductOption(id: string, productOption: Partial<ProductOptionEntity>): Promise<ProductOptionEntity | null>;
  deleteProductOption(id: string): Promise<boolean>;

  // Bulk ProductOption operations
  createBulkProductOptions(productOptions: ProductOptionEntity[]): Promise<ProductOptionEntity[]>;
  updateBulkProductOptions(options: Array<Partial<ProductOptionEntity> & { optionId: string }>): Promise<ProductOptionEntity[]>;
  deleteBulkProductOptions(optionIds: string[]): Promise<boolean>;

  // ProductVariant operations
  findVariantsByOptionId(optionId: string): Promise<ProductVariantEntity[]>;
  createBulkProductVariants(variants: ProductVariant[]): Promise<any>;
  updateBulkProductVariants(variants: Array<Partial<ProductVariant> & { variant_id: string }>): Promise<any>;
  deleteBulkProductVariants(variantIds: string[]): Promise<boolean>;

  // Sync denormalized fields
  syncProductOptionPricing(optionId: string): Promise<void>;
}


