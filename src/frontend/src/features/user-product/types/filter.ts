export type SortOrder = "asc" | "desc";
export type SortBy = "price" | "createdAt" | "sold" | "rating";

export interface FilterOptions {
  cursor?: string;
  limit?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  categoryId?: string[];
  colorFamily?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}
