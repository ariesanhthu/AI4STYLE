export type SortOrder = "asc" | "desc";

export interface FilterOptions {
  cursor?: string;
  limit?: number;
  sortOrder?: SortOrder;
  categoryId?: string[];
  colorFamily?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}
