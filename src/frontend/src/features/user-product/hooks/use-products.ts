"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Product } from "../types/product";
import { FilterOptions, SortBy, SortOrder } from "../types/filter";
import { productService } from "../services/product.service";

const DEFAULT_LIMIT = 8;

export function useProducts(initialFilters?: FilterOptions) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // Dùng Ref để ngăn chặn race condition khi fetch nhanh liên tục
  const lastFetchId = useRef(0);

  // 1. Memoize stable limit
  const stableLimit = useMemo(() => 
    initialFilters?.limit || DEFAULT_LIMIT.toString(), 
    [initialFilters?.limit]
  );

  // 2. Derive filters từ URL - Output là Object nhưng nội dung ổn định
  const filters = useMemo((): FilterOptions => {
    return {
      limit: searchParams.get("limit") || stableLimit,
      sortOption: (searchParams.get("sortOption") as SortBy) || "time",
      sortOrder: (searchParams.get("sortOrder") as SortOrder) || "desc",
      category_id: searchParams.get("category_id") || undefined,
      color_family: searchParams.get("color_family") || undefined,
      min_price: searchParams.get("min_price") || undefined,
      max_price: searchParams.get("max_price") || undefined,
      search: searchParams.get("search") || undefined,
    };
  }, [searchParams, stableLimit]);

  // 3. Hàm Fetch chính - Dùng JSON.stringify làm dependency
  const fetchProducts = useCallback(
    async (isLoadMore: boolean = false, cursor?: string) => {
      const fetchId = ++lastFetchId.current;
      
      try {
        isLoadMore ? setIsLoadingMore(true) : setLoading(true);

        const { data, nextCursor: newNextCursor } =
          await productService.getProducts({ ...filters, cursor });

        // Nếu đã có fetch mới hơn thì bỏ qua kết quả này
        if (fetchId !== lastFetchId.current) return;

        setProducts((prev) => {
          if (!isLoadMore) return data;
          const existingIds = new Set(prev.map((p) => p.optionId));
          const newItems = data.filter((p) => !existingIds.has(p.optionId));
          return [...prev, ...newItems];
        });

        setNextCursor(newNextCursor);
        setError(null);
      } catch (err) {
        if (fetchId === lastFetchId.current) {
          setError("Failed to fetch products");
          console.error(err);
        }
      } finally {
        if (fetchId === lastFetchId.current) {
          isLoadMore ? setIsLoadingMore(false) : setLoading(false);
        }
      }
    },
    [JSON.stringify(filters)] // KHÓA LOOP: Chỉ tạo lại hàm khi giá trị filter thực sự đổi
  );

  // 4. Trigger fetch khi filters thay đổi
  useEffect(() => {
    setNextCursor(undefined); 
    fetchProducts(false, undefined);
  }, [JSON.stringify(filters), fetchProducts]);

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([key, value]) => {
      if (key === "cursor") return;
      if (value === undefined || value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => router.push(pathname);

  const loadMore = useCallback(() => {
    if (nextCursor && !isLoadingMore) {
      fetchProducts(true, nextCursor);
    }
  }, [nextCursor, isLoadingMore, fetchProducts]);

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