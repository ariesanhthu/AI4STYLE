export declare class CategoryException extends Error {
    constructor(message: string);
}
export declare class CategoryNotFoundException extends CategoryException {
    constructor(identifier: string);
}
export declare class CategorySlugAlreadyExistsException extends CategoryException {
    constructor(slug: string);
}
export declare class CategoryNameAlreadyExistsException extends CategoryException {
    constructor(name: string);
}
export declare class CategoryCircularReferenceException extends CategoryException {
    constructor(categoryId: string, parentId: string);
}
export declare class CategoryHasChildrenException extends CategoryException {
    constructor(categoryId: string);
}
export declare class CategoryHasProductsException extends CategoryException {
    constructor(categoryId: string);
}
