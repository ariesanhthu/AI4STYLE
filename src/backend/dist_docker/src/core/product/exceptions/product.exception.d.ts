export declare class ProductException extends Error {
    constructor(message: string);
}
export declare class ProductNotFoundException extends ProductException {
    constructor(identifier: string);
}
export declare class ProductSlugAlreadyExistsException extends ProductException {
    constructor(slug: string);
}
export declare class ProductOptionNotFoundException extends ProductException {
    constructor(identifier: string);
}
export declare class ProductCreationException extends ProductException {
    constructor(message: string);
}
export declare class ProductUpdateException extends ProductException {
    constructor(message: string);
}
export declare class ProductDeletionException extends ProductException {
    constructor(message: string);
}
export declare class InsufficientInventoryException extends ProductException {
    constructor(identifier: string);
}
export declare class ProductVariantNotFoundException extends ProductException {
    constructor(identifier: string);
}
