import { ProductService } from '@/application/product/services/product.service';
import { BaseProductController } from './base-product.controller';
import type { GetListProductClientDto, GetBestSellerDto } from '@/application/product/dtos';
export declare class ProductClientController extends BaseProductController {
    protected readonly productService: ProductService;
    constructor(productService: ProductService);
    getAllProductOptions(query: GetListProductClientDto): Promise<{
        items: {
            optionId: string;
            productId: string;
            name: string;
            slug: string;
            color: string;
            colorFamily: string;
            thumbnail: string | null;
            images: string[];
            price: number;
            newPrice: number | null;
            outOfStock: boolean;
            isShow: boolean;
            search: string;
            createdAt: Date;
            updatedAt: Date;
            hasDiscount: boolean;
            discountPercentage: number | null;
            variants: {
                variantId: string;
                optionId: string;
                sku: string;
                size: string;
                price: number;
                newPrice: number | null;
                stockQuantity: number;
                createdAt: Date;
                updatedAt: Date;
                hasDiscount: boolean;
                discountPercentage: number | null;
                inStock: boolean;
                lowStock: boolean;
            }[] | undefined;
        }[];
        nextCursor: string | null;
    }>;
    getProductOptionById(id: string): Promise<{}>;
    getBestSellers(query: GetBestSellerDto): Promise<{
        items: any[];
        nextCursor: string | null;
    }>;
}
