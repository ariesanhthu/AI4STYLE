'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/open-api-client';
import { Product, ProductFilters, SortOption } from '../types/product';

const MOCK_ENABLED = true; // Set to false to use real API

// Mock data for development
const mockProducts: Product[] = [];

export const useProducts = (filters?: ProductFilters, sort?: SortOption) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (MOCK_ENABLED) {
          // Mock mode for UI development
          await new Promise(resolve => setTimeout(resolve, 500));
          setProducts(mockProducts);
        } else {
          // Real API call
          const response = await apiClient.GET('/shop/v1/client/home-page', {});

          if (response.error) {
            throw new Error(response.error.message || 'Failed to fetch products');
          }

          if (response.data?.data) {
            // Extract products from homepage response
            const productsData = response.data.data.products || [];
            setProducts(productsData);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Failed to fetch products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, isLoading, error };
};
