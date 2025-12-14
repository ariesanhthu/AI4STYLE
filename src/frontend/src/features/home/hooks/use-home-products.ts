import { useState, useEffect } from "react";
import { productService } from "@/features/user-product/services/product.service";
import { Product } from "@/features/user-product/types/product";

export function useHomeProducts() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newestProducts, setNewestProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [bestSellersData, newestData] = await Promise.all([
          productService.getBestSellers(),
          productService.getProducts({
            limit: 10,
            sortBy: "createdAt",
            sortOrder: "desc",
          }),
        ]);

        setBestSellers(bestSellersData);
        setNewestProducts(newestData.data);
      } catch (err) {
        console.error("Error fetching home products:", err);
        setError("Failed to load home products");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return {
    bestSellers,
    newestProducts,
    loading,
    error,
  };
}
