import { useEffect, useRef, useState } from "react";
import { Product } from "../types/product";
import { FilterOptions } from "../types/filter";
import { ProductGrid } from "./product-grid";
import { SortDropdown } from "./sort-dropdown";
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
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [loaderRatio, setLoaderRatio] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const thresholds = Array.from({ length: 21 }, (_, i) => i * 0.05); // 0, 0.05, ..., 1.0

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setLoaderRatio(entry.intersectionRatio);

        // Trigger load only when fully visible
        if (entry.intersectionRatio >= 1 && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      { threshold: thresholds }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, onLoadMore]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Sản phẩm ({total})</h2>
        {isMounted ? (
          <SortDropdown
            sortOrder={filters.sortOrder}
            sortOption={filters.sortOption}
            onSortChange={(newSort) =>
              onUpdateFilters(
                newSort || { sortOption: undefined, sortOrder: undefined }
              )
            }
          />
        ) : (
          <div className="h-10 w-[180px]" /> // Placeholder to prevent layout shift
        )}
      </div>

      <ProductGrid products={products} loading={loading} />

      {(hasMore || isLoadingMore) && (
        <div
          ref={loadMoreRef}
          className="mt-8 flex h-32 items-center justify-center transition-opacity duration-300"
          style={{ opacity: Math.max(0.2, loaderRatio) }}
        >
          <div
            className="flex flex-col items-center gap-2"
            style={{
              transform: `scale(${0.5 + loaderRatio * 1.0})`, // Grows from 0.5x to 1.5x
              transition: "transform 0.1s ease-out",
            }}
          >
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <span className="text-xs font-medium text-gray-500">
              {isLoadingMore ? "Đang tải..." : "Thả để tải thêm"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
