export declare class ProductVariantEntity {
    readonly variantId: string;
    optionId: string;
    sku: string;
    size: string;
    price: number;
    newPrice: number;
    stockQuantity: number;
    readonly createdAt: Date;
    updatedAt: Date;
    constructor(variantId: string, optionId: string, sku: string, size: string, price: number, newPrice: number, stockQuantity: number, createdAt: Date, updatedAt: Date);
    getDisplayPrice(): number;
    hasDiscount(): boolean;
    getDiscountPercentage(): number | null;
    isInStock(): boolean;
    isLowStock(threshold?: number): boolean;
    toJSON(): {
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
    };
}
