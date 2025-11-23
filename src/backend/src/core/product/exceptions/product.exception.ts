export class ProductException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductException';
  }
}

export class ProductNotFoundException extends ProductException {
  constructor(identifier: string) {
    super(`Product with identifier ${identifier} not found`);
    this.name = 'ProductNotFoundException';
  }
}

export class ProductSlugAlreadyExistsException extends ProductException {
  constructor(slug: string) {
    super(`Product with slug ${slug} already exists`);
    this.name = 'ProductSlugAlreadyExistsException';
  }
}

export class ProductOptionNotFoundException extends ProductException {
  constructor(identifier: string) {
    super(`Product option with identifier ${identifier} not found`);
    this.name = 'ProductOptionNotFoundException';
  }
}

export class ProductCreationException extends ProductException {
  constructor(message: string) {
    super(`Failed to create product: ${message}`);
    this.name = 'ProductCreationException';
  }
}

export class ProductUpdateException extends ProductException {
  constructor(message: string) {
    super(`Failed to update product: ${message}`);
    this.name = 'ProductUpdateException';
  }
}

export class ProductDeletionException extends ProductException {
  constructor(message: string) {
    super(`Failed to delete product: ${message}`);
    this.name = 'ProductDeletionException';
  }
}

export class InsufficientInventoryException extends ProductException {
  constructor(identifier: string) {
    super(`Insufficient inventory for product variant ${identifier}`);
    this.name = 'InsufficientInventoryException';
  }
}

export class ProductVariantNotFoundException extends ProductException {
  constructor(identifier: string) {
    super(`Product variant with identifier ${identifier} not found`);
    this.name = 'ProductVariantNotFoundException';
  }
}
