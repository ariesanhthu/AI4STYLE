import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchProduct = async () => {
      // Check if we're on a product detail page
      const productSlugMatch = pathname?.match(/\/products\/([^/]+)/);
      const productId = searchParams?.get("id");

      if (productSlugMatch || productId) {
        try {
          let productData: Product | null = null;

          if (productId) {
            productData = await productDetailsService.getProductById(productId);
          } else if (productSlugMatch) {
            const slug = productSlugMatch[1];
            productData = await productDetailsService.getProduct(slug);
          }

          setProduct(productData);
        } catch (error) {
          console.error("Error fetching product from context:", error);
          setProduct(null);
        }
      } else {
        setProduct(null);
      }
    };

    fetchProduct();
  }, [pathname, searchParams]);

  return product;
}

