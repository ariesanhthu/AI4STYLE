import { useEffect, useState, useMemo, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Product } from "@/features/user-product/types/product";
import { productDetailsService } from "@/features/user-product-details/services/product-details.service";

/**
 * Hook to get current product from URL context (product detail page).
 * 
 * Returns:
 *   Product | null - Current product if on product detail page, null otherwise
 */
export function useProductContext(): Product | null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  
  // Memoize product identifier để tránh re-fetch không cần thiết
  const productIdentifier = useMemo(() => {
    const productSlugMatch = pathname?.match(/\/products\/([^/]+)/);
    const productId = searchParams?.get("id");
    return productId || productSlugMatch?.[1] || null;
  }, [pathname, searchParams]);
  
  // Track last fetched ID để tránh fetch lại cùng product
  const lastFetchedId = useRef<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      // Nếu không có identifier, clear product và return
      if (!productIdentifier) {
        if (lastFetchedId.current !== null) {
          setProduct(null);
          lastFetchedId.current = null;
        }
        return;
      }

      // Nếu đã fetch cùng product rồi, skip
      if (lastFetchedId.current === productIdentifier) {
        return;
      }

      try {
        let productData: Product | null = null;

        // Check if it's an ID (UUID format) or slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productIdentifier);
        
        if (isUUID) {
          productData = await productDetailsService.getProductById(productIdentifier);
        } else {
          productData = await productDetailsService.getProduct(productIdentifier);
        }

        setProduct(productData);
        lastFetchedId.current = productIdentifier;
      } catch (error) {
        console.error("Error fetching product from context:", error);
        setProduct(null);
        lastFetchedId.current = null;
      }
    };

    fetchProduct();
  }, [productIdentifier]);

  return product;
}

