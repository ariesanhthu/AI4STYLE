"use client";

import { useState, useEffect } from "react";
import { Product } from "../types/product";

const API_BASE_URL = "https://backend.com";
const DUMMY_JSON_URL = "dummy.json";

export const useProducts = (
  useDummy: boolean = false
  // filters?: ProductFilters,
  // sort?: SortOption,
) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let response;
        if (useDummy) {
          response = await fetch(DUMMY_JSON_URL);
        } else {
          response = await fetch(`${API_BASE_URL}/api/v4/products`);
        }

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        if (useDummy) {
          setProducts(data.products);
          return;
        }
        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [useDummy]);

  return { products, isLoading, error };
};
