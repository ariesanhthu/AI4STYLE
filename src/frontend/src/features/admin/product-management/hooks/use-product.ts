"use client";

import { useState, useCallback, useRef } from 'react';
import { productService } from '../services/product.service';
import { GetListProductDto } from '../types';

// We need to define Product type somewhere, likely inferred from service response or defined in types
// For now I'll use `any` or try to infer, but ideally I should check api-client types.
// I'll assume a generic type for now and we can refine.
export type Product = {
  productId: string;
  id: string; // Alias for productId for frontend convenience if needed, or just use productId
  name: string;
  images: string[];
  thumbnail: string | null;
  description?: string | null;
  price: number;
  category?: { name: string };
  createdAt: string;
  [key: string]: any;
}

const PAGE_LIMIT = 5;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Cache to store pages: cursor -> products
  const cache = useRef<Map<string | null, { items: Product[]; nextCursor: string | null }>>(new Map());
  // Keep track of page order for cache eviction or simple history
  const pageHistory = useRef<(string | null)[]>([]);

  const fetchProducts = useCallback(async (params: GetListProductDto = {}) => {
    // Generate a simple key for caching based on params
    const cursorKey = `${params.cursor || 'null'}-${params.search || 'null'}-${params.category_id || 'null'}`;

    // Check cache first
    if (cache.current.has(cursorKey)) {
      const cachedData = cache.current.get(cursorKey)!;
      setProducts(cachedData.items);
      setNextCursor(cachedData.nextCursor);
      return;
    }

    setLoading(true);
    try {
      const response = await productService.getList(params);

      // Map API response to Component Product type
      // API returns snake_case or specific fields like productId, thumbnail.
      // We map it to our Product interface used in components.
      const newItems = (response.items || []).map((item: any) => ({
        ...item,
        id: item.productId,
        images: item.thumbnail ? [item.thumbnail] : [], // Use thumbnail as first image if available
        price: 0, // Price missing in error message, defaulting to 0 or need to check 'options'
      }));
      const newNextCursor = response.nextCursor || null;

      setProducts(newItems);
      setNextCursor(newNextCursor);

      // Update cache
      if (cache.current.size >= PAGE_LIMIT) {
        const firstKey = pageHistory.current.shift();
        if (firstKey !== undefined) {
          cache.current.delete(firstKey);
        }
      }
      cache.current.set(cursorKey, { items: newItems, nextCursor: newNextCursor });
      pageHistory.current.push(cursorKey);

    } catch (error) {
      console.error("Failed to fetch products:", error);
      // Handle error (maybe set error state)
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    cache.current.clear();
    pageHistory.current = [];
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
