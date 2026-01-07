import { ProductOptionEntity } from './product-option.entity';
export declare class ProductEntity {
    readonly productId: string;
    categoryId: string;
    name: string;
    description: string | null;
    thumbnail: string | null;
    search: string;
    readonly createdAt: Date;
    updatedAt: Date;
    options?: ProductOptionEntity[] | undefined;
    constructor(productId: string, categoryId: string, name: string, description: string | null, thumbnail: string | null, search: string, createdAt: Date, updatedAt: Date, options?: ProductOptionEntity[] | undefined);
    toJSON(): {
        productId: string;
        categoryId: string;
        name: string;
        description: string | null;
        thumbnail: string | null;
        createdAt: Date;
        updatedAt: Date;
        options: {
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
        }[] | undefined;
    };
}
