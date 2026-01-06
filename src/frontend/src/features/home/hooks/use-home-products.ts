import { useState, useEffect, useRef } from "react";
import { productService } from "@/features/user-product/services/product.service";
import { Product } from "@/features/user-product/types/product";

export function useHomeProducts() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newestProducts, setNewestProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Guard để tránh fetch lại khi đã có data hoặc đang fetch
  const hasFetched = useRef(false);
  const isFetching = useRef(false);
  const mountId = useRef(Math.random().toString(36).substring(7));

  useEffect(() => {
    console.log(`[useHomeProducts] Mount ID: ${mountId.current}, hasFetched: ${hasFetched.current}, isFetching: ${isFetching.current}`);
    
    // Chỉ fetch 1 lần khi mount
    if (hasFetched.current || isFetching.current) {
      console.log(`[useHomeProducts] Skipping fetch - already fetched or fetching`);
      return;
    }

    const fetchHomeData = async () => {
      isFetching.current = true;
      console.log(`[useHomeProducts] Starting fetch...`);
      
      try {
        setLoading(true);
        setError(null);
        
        const [bestSellersData, newestData] = await Promise.all([
          productService.getBestSellers(),
          productService.getProducts({
            limit: "10",
            sortOption: "time",
            sortOrder: "desc",
          }),
        ]);

        console.log(`[useHomeProducts] Fetch completed:`, {
          bestSellersCount: bestSellersData.length,
          newestCount: newestData.data.length,
        });

        setBestSellers(bestSellersData);
        setNewestProducts(newestData.data);
        hasFetched.current = true;
      } catch (err) {
        console.error("[useHomeProducts] Error fetching home products:", err);
        setError("Failed to load home products");
        // Reset guard on error để có thể retry
        hasFetched.current = false;
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    };

    fetchHomeData();

    // Cleanup function để log khi unmount
    return () => {
      console.log(`[useHomeProducts] Unmounting - Mount ID: ${mountId.current}`);
    };
  }, []); // Empty dependency - chỉ chạy 1 lần khi mount

  return {
    bestSellers,
    newestProducts,
    loading,
    error,
  };
}
