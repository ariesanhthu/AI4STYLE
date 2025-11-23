export class CategoryException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CategoryException';
  }
}

export class CategoryNotFoundException extends CategoryException {
  constructor(identifier: string) {
    super(`Category with identifier ${identifier} not found`);
    this.name = 'CategoryNotFoundException';
  }
}

export class CategorySlugAlreadyExistsException extends CategoryException {
  constructor(slug: string) {
    super(`Category with slug ${slug} already exists`);
    this.name = 'CategorySlugAlreadyExistsException';
  }
}

export class CategoryCircularReferenceException extends CategoryException {
  constructor(categoryId: string, parentId: string) {
    super(`Circular reference detected between category ${categoryId} and parent ${parentId}`);
    this.name = 'CategoryCircularReferenceException';
  }
}

export class CategoryHasChildrenException extends CategoryException {
  constructor(categoryId: string) {
    super(`Category ${categoryId} has children and cannot be deleted`);
    this.name = 'CategoryHasChildrenException';
  }
}

export class CategoryHasProductsException extends CategoryException {
  constructor(categoryId: string) {
    super(`Category ${categoryId} has products and cannot be deleted`);
    this.name = 'CategoryHasProductsException';
  }
}
