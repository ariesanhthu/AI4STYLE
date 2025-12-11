import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Product } from "../types/product";
import { FilterOptions, SortBy, SortOrder } from "../types/filter";
import { productService } from "../services/product.service";

export function useProducts(initialFilters?: FilterOptions) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Derive filters from URL search params
  const filters = useMemo((): FilterOptions => {
    const params = new URLSearchParams(searchParams.toString());
    const initialLimit = initialFilters?.limit || 12;

    return {
      limit: Number(params.get("limit")) || initialLimit,
      cursor: params.get("cursor") || undefined,
      sortBy: (params.get("sortBy") as SortBy) || undefined,
      sortOrder: (params.get("sortOrder") as SortOrder) || undefined,
      categoryId: params.get("categoryId")
        ? params.get("categoryId")?.split(",")
        : undefined,
      colorFamily: params.get("colorFamily")
        ? params.get("colorFamily")?.split(",")
        : undefined,
      minPrice: params.get("minPrice")
        ? Number(params.get("minPrice"))
        : undefined,
      maxPrice: params.get("maxPrice")
        ? Number(params.get("maxPrice"))
        : undefined,
      search: params.get("search") || undefined,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Update URL when filters change
  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(","));
        } else {
          params.delete(key);
        }
      } else {
        params.set(key, String(value));
      }
    });

    // Reset cursor when filters change
    if (!newFilters.cursor) {
      params.delete("cursor");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const {
          data,
          total,
          nextCursor: newNextCursor,
        } = await productService.getProducts(filters);
        setProducts(data);
        setTotal(total);
        setNextCursor(newNextCursor);
        setError(null);
      } catch (err) {
        setError("Failed to fetch products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return {
    products,
    loading,
    error,
    filters,
    total,
    nextCursor,
    updateFilters,
    clearFilters,
  };
}
