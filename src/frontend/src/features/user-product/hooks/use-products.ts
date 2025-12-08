import { useState, useEffect } from "react";
import { Product } from "../types/product";
import { FilterOptions } from "../types/filter";
import { productService } from "../services/product.service";

export function useProducts(initialFilters?: FilterOptions) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(initialFilters || {});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, total } = await productService.getProducts(filters);
        setProducts(data);
        setTotal(total);
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

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    products,
    loading,
    error,
    filters,
    total,
    updateFilters,
    clearFilters,
  };
}
