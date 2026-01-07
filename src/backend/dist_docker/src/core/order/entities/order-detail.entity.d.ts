import { ProductVariantEntity } from "@/core/product/entities";
export declare class OrderDetailEntity {
    readonly orderDetailId: string;
    readonly orderId: string;
    readonly variantId: string;
    quantity: number;
    pricePerUnit: number;
    readonly createdAt: Date;
    updatedAt: Date;
    variant?: ProductVariantEntity | undefined;
    constructor(orderDetailId: string, orderId: string, variantId: string, quantity: number, pricePerUnit: number, createdAt: Date, updatedAt: Date, variant?: ProductVariantEntity | undefined);
    toJSON(): {
        orderDetailId: string;
        orderId: string;
        variantId: string;
        quantity: number;
        pricePerUnit: number;
        createdAt: Date;
        updatedAt: Date;
        variant: {
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
        } | null;
    };
}
