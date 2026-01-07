export declare function buildSlug(text: string, options?: {
    separator?: string;
    lowercase?: boolean;
    maxLength?: number;
}): string;
export declare function buildUniqueSlug(baseSlug: string, existingSlugs: string[]): string;
export declare function buildProductSlug(name: string, color: string): string;
