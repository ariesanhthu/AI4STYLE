"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantNotFoundException = exports.InsufficientInventoryException = exports.ProductDeletionException = exports.ProductUpdateException = exports.ProductCreationException = exports.ProductOptionNotFoundException = exports.ProductSlugAlreadyExistsException = exports.ProductNotFoundException = exports.ProductException = void 0;
class ProductException extends Error {
    constructor(message) {
        super(message);
        this.name = 'ProductException';
    }
}
exports.ProductException = ProductException;
class ProductNotFoundException extends ProductException {
    constructor(identifier) {
        super(`Product with identifier ${identifier} not found`);
        this.name = 'ProductNotFoundException';
    }
}
exports.ProductNotFoundException = ProductNotFoundException;
class ProductSlugAlreadyExistsException extends ProductException {
    constructor(slug) {
        super(`Product with slug ${slug} already exists`);
        this.name = 'ProductSlugAlreadyExistsException';
    }
}
exports.ProductSlugAlreadyExistsException = ProductSlugAlreadyExistsException;
class ProductOptionNotFoundException extends ProductException {
    constructor(identifier) {
        super(`Product option with identifier ${identifier} not found`);
        this.name = 'ProductOptionNotFoundException';
    }
}
exports.ProductOptionNotFoundException = ProductOptionNotFoundException;
class ProductCreationException extends ProductException {
    constructor(message) {
        super(`Failed to create product: ${message}`);
        this.name = 'ProductCreationException';
    }
}
exports.ProductCreationException = ProductCreationException;
class ProductUpdateException extends ProductException {
    constructor(message) {
        super(`Failed to update product: ${message}`);
        this.name = 'ProductUpdateException';
    }
}
exports.ProductUpdateException = ProductUpdateException;
class ProductDeletionException extends ProductException {
    constructor(message) {
        super(`Failed to delete product: ${message}`);
        this.name = 'ProductDeletionException';
    }
}
exports.ProductDeletionException = ProductDeletionException;
class InsufficientInventoryException extends ProductException {
    constructor(identifier) {
        super(`Insufficient inventory for product variant ${identifier}`);
        this.name = 'InsufficientInventoryException';
    }
}
exports.InsufficientInventoryException = InsufficientInventoryException;
class ProductVariantNotFoundException extends ProductException {
    constructor(identifier) {
        super(`Product variant with identifier ${identifier} not found`);
        this.name = 'ProductVariantNotFoundException';
    }
}
exports.ProductVariantNotFoundException = ProductVariantNotFoundException;
//# sourceMappingURL=product.exception.js.map