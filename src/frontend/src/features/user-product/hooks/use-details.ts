"use client";

import { useState, useEffect } from "react";
import { Product } from "../types/product";

const API_BASE_URL = "https://backend.com";
const DUMMY_JSON_URL = "dummy.json";

export const useDetails = (useDummy: boolean = false, id: string) => {
  const [details, setDetails] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (useDummy) {
          const res = await fetch(DUMMY_JSON_URL);
          if (!res.ok) throw new Error(`Error: ${res.status}`);
          const data = await res.json();

          // Find the product by ID
          const product = data.products.find((p: Product) => p.id === id);
          if (!product) throw new Error("Product not found");
          setDetails(product);
        } else {
          const res = await fetch(`${API_BASE_URL}/api/v4/products/${id}`);
          if (!res.ok) throw new Error(`Error: ${res.status}`);
          const product: Product = await res.json();
          setDetails(product);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [useDummy, id]);

  return { details, isLoading, error };
};
