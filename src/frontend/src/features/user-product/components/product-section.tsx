import { Product } from "../types/product";
import { FilterOptions } from "../types/filter";
import { ProductGrid } from "./product-grid";
import { SortDropdown } from "./sort-dropdown";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";

interface ProductSectionProps {
  products: Product[];
  loading: boolean;
  isLoadingMore: boolean;
  total: number;
  filters: FilterOptions;
  hasMore: boolean;
  onLoadMore: () => void;
  onUpdateFilters: (newFilters: Partial<FilterOptions>) => void;
}

export function ProductSection({
  products,
  loading,
  isLoadingMore,
  total,
  filters,
  hasMore,
  onLoadMore,
  onUpdateFilters,
}: ProductSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Sản phẩm ({total})</h2>
        <SortDropdown
          sortOrder={filters.sortOrder}
          sortOption={filters.sortOption}
          onSortChange={(newSort) =>
            onUpdateFilters(
              newSort || { sortOption: undefined, sortOrder: undefined }
            )
          }
        />
      </div>

      <ProductGrid products={products} loading={loading} />

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="min-w-[150px]"
          >
            {isLoadingMore ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoadingMore ? "Đang tải..." : "Xem thêm"}
          </Button>
        </div>
      )}
    </div>
  );
}
