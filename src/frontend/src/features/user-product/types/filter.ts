export type SortOrder = "asc" | "desc";
export type SortBy = "price" | "time";

export interface FilterOptions {
  cursor?: string | undefined;
  limit?: string | undefined;
  sortOrder?: SortOrder;
  category_id?: string | undefined;
  color_family?: string | undefined;
  min_price?: string | undefined;
  max_price?: string | undefined;
  search?: string | undefined;
  sortOption?: SortBy;
}
