export declare class CategoryEntity {
    readonly categoryId: string;
    parentId: string | null;
    name: string;
    slug: string;
    icon: string | null;
    description: string | null;
    search: string;
    readonly createdAt: Date;
    updatedAt: Date;
    parent?: (CategoryEntity | null) | undefined;
    constructor(categoryId: string, parentId: string | null, name: string, slug: string, icon: string | null, description: string | null, search: string, createdAt: Date, updatedAt: Date, parent?: (CategoryEntity | null) | undefined);
    toJSON(): any;
}
