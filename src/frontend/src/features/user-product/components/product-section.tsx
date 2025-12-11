import { Product } from "../types/product";
import { FilterOptions } from "../types/filter";
import { ProductGrid } from "./product-grid";
import { Pagination } from "./pagination";
import { SortDropdown } from "./sort-dropdown";

interface ProductSectionProps {
  products: Product[];
  loading: boolean;
  total: number;
  filters: FilterOptions;
  onUpdateFilters: (newFilters: Partial<FilterOptions>) => void;
}

export function ProductSection({
  products,
  loading,
  total,
  filters,
  onUpdateFilters,
}: ProductSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Sản phẩm ({total})</h2>
        <SortDropdown
          sortOrder={filters.sortOrder}
          sortBy={filters.sortBy}
          onSortChange={(newSort) =>
            onUpdateFilters(
              newSort || { sortBy: undefined, sortOrder: undefined }
            )
          }
        />
      </div>

      <ProductGrid products={products} loading={loading} />

      <Pagination
        currentPage={1} // TODO: Implement pagination logic in hook/service
        totalPages={Math.ceil(total / (filters.limit || 12))}
        onPageChange={(page) => console.log("Page changed:", page)}
      />
    </div>
  );
}
