import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Product } from "../types/product";
import { FilterOptions, SortBy, SortOrder } from "../types/filter";
import { productService } from "../services/product.service";

const PAGE_LIMIT = 8;

export function useProducts(initialFilters?: FilterOptions) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Derive filters from URL search params (excluding cursor)
  const filters = useMemo((): FilterOptions => {
    const params = new URLSearchParams(searchParams.toString());
    const initialLimit = initialFilters?.limit || PAGE_LIMIT.toString();

    return {
      limit: params.get("limit") || initialLimit,
      // Cursor is managed internally for Load More
      sortOption: (params.get("sortOption") as SortBy) || "time",
      sortOrder: (params.get("sortOrder") as SortOrder) || "desc",
      category_id: params.get("category_id") || undefined,
      color_family: params.get("color_family") || undefined,
      min_price: params.get("min_price") || undefined,
      max_price: params.get("max_price") || undefined,
      search: params.get("search") || undefined,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Update URL when filters change
  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newFilters).forEach(([key, value]) => {
      // Skip cursor updates to URL for standard Load More behavior
      if (key === "cursor") return;

      if (value === undefined || value === null) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const fetchProducts = useCallback(
    async (isLoadMore: boolean = false, cursor?: string) => {
      try {
        if (!isLoadMore) {
          setLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const { data, nextCursor: newNextCursor } =
          await productService.getProducts({ ...filters, cursor });

        if (!isLoadMore) {
          setProducts(data);
        } else {
          setProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p.optionId));
            const newProducts = data.filter((p) => {
              if (existingIds.has(p.optionId)) return false;
              existingIds.add(p.optionId);
              return true;
            });
            return [...prev, ...newProducts];
          });
        }

        setNextCursor(newNextCursor);
        setError(null);
      } catch (err) {
        setError("Failed to fetch products");
        console.error(err);
      } finally {
        if (!isLoadMore) {
          setLoading(false);
        } else {
          setIsLoadingMore(false);
        }
      }
    },
    [filters]
  );

  // Initial fetch when filters change
  useEffect(() => {
    setNextCursor(undefined); // Reset cursor
    fetchProducts(false, undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadMore = useCallback(() => {
    if (nextCursor) {
      fetchProducts(true, nextCursor);
    }
  }, [nextCursor, fetchProducts]);

  return {
    products,
    loading,
    isLoadingMore,
    error,
    filters,
    total: products.length,
    nextCursor,
    hasMore: !!nextCursor,
    loadMore,
    updateFilters,
    clearFilters,
  };
}
