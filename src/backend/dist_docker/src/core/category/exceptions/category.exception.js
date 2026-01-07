"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryHasProductsException = exports.CategoryHasChildrenException = exports.CategoryCircularReferenceException = exports.CategoryNameAlreadyExistsException = exports.CategorySlugAlreadyExistsException = exports.CategoryNotFoundException = exports.CategoryException = void 0;
class CategoryException extends Error {
    constructor(message) {
        super(message);
        this.name = 'CategoryException';
    }
}
exports.CategoryException = CategoryException;
class CategoryNotFoundException extends CategoryException {
    constructor(identifier) {
        super(`Category with identifier ${identifier} not found`);
        this.name = 'CategoryNotFoundException';
    }
}
exports.CategoryNotFoundException = CategoryNotFoundException;
class CategorySlugAlreadyExistsException extends CategoryException {
    constructor(slug) {
        super(`Category with slug ${slug} already exists`);
        this.name = 'CategorySlugAlreadyExistsException';
    }
}
exports.CategorySlugAlreadyExistsException = CategorySlugAlreadyExistsException;
class CategoryNameAlreadyExistsException extends CategoryException {
    constructor(name) {
        super(`Category with name ${name} already exists`);
        this.name = 'CategoryNameAlreadyExistsException';
    }
}
exports.CategoryNameAlreadyExistsException = CategoryNameAlreadyExistsException;
class CategoryCircularReferenceException extends CategoryException {
    constructor(categoryId, parentId) {
        super(`Circular reference detected between category ${categoryId} and parent ${parentId}`);
        this.name = 'CategoryCircularReferenceException';
    }
}
exports.CategoryCircularReferenceException = CategoryCircularReferenceException;
class CategoryHasChildrenException extends CategoryException {
    constructor(categoryId) {
        super(`Category ${categoryId} has children and cannot be deleted`);
        this.name = 'CategoryHasChildrenException';
    }
}
exports.CategoryHasChildrenException = CategoryHasChildrenException;
class CategoryHasProductsException extends CategoryException {
    constructor(categoryId) {
        super(`Category ${categoryId} has products and cannot be deleted`);
        this.name = 'CategoryHasProductsException';
    }
}
exports.CategoryHasProductsException = CategoryHasProductsException;
//# sourceMappingURL=category.exception.js.map