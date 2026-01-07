export declare function buildSearchString(...fields: (string | null | undefined)[]): string;
export declare function buildProductSearch(name: string, description?: string | null): string;
export declare function buildCategorySearch(name: string, description?: string | null): string;
export declare function matchesSearch(searchText: string, query: string): boolean;
