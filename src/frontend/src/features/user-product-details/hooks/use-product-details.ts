import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "../../user-product/types/product";
import {
  Review,
  productDetailsService,
} from "../services/product-details.service";

export function useProductDetails(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [otherProducts, setOtherProducts] = useState<Product[]>([]);
  const [sameColorProducts, setSameColorProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  useEffect(() => {
    const fetchData = async () => {
      if (!slug && !id) return;

      try {
        setLoading(true);
        let productData: Product | null = null;

        if (id) {
          productData = await productDetailsService.getProductById(id);
        }

        // Fallback to slug if ID lookup failed or no ID
        if (!productData) {
          productData = await productDetailsService.getProduct(slug);
        }

        if (!productData) {
          setError("Product not found");
          return;
        }

        setProduct(productData);

        const [reviewsData, otherProductsData, sameColorProductsData] =
          await Promise.all([
            productDetailsService.getReviews(),
            productDetailsService.getOtherProducts(),
            productData.color
              ? productDetailsService.getSameColorProducts(productData.color)
              : Promise.resolve([]),
          ]);

        setReviews(reviewsData);
        setOtherProducts(otherProductsData);
        setSameColorProducts(sameColorProductsData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch product details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, id]);

  return {
    product,
    reviews,
    otherProducts,
    sameColorProducts,
    loading,
    error,
  };
}
