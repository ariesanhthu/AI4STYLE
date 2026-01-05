import { useState, useCallback, useRef } from 'react';
import productService from '../services/product.service';
import { Product, ProductFilter } from '../types/product.type';

const CACHE_LIMIT = 5;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Cache: key -> { items, nextCursor }
  const cache = useRef<Map<string, { items: Product[]; nextCursor: string | null }>>(new Map());
  const cacheKeys = useRef<string[]>([]);

  const fetchProducts = useCallback(async (params: ProductFilter = {}) => {
    // Create a cache key based on params
    const key = JSON.stringify(params);

    if (cache.current.has(key)) {
      const cached = cache.current.get(key)!;
      setProducts(cached.items);
      setNextCursor(cached.nextCursor);
      return;
    }

    setLoading(true);
    try {
      const response = await productService.getProducts(params);

      const newItems = response.data.items;
      const newNextCursor = response.data.nextCursor;

      setProducts(newItems);
      setNextCursor(newNextCursor);

      // Update cache
      if (cache.current.size >= CACHE_LIMIT) {
        const oldestKey = cacheKeys.current.shift();
        if (oldestKey) cache.current.delete(oldestKey);
      }
      cache.current.set(key, { items: newItems, nextCursor: newNextCursor });
      cacheKeys.current.push(key);

    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    cache.current.clear();
    cacheKeys.current = [];
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    nextCursor,
    fetchProducts,
    refresh,
  };
}
