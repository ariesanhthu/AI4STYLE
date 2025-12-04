import { useState, useEffect } from "react";
import { Product } from "../../user-product/types/product";
import {
  Review,
  productDetailsService,
} from "../services/product-details.service";

export function useProductDetails(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const productData = await productDetailsService.getProduct(slug);

        if (!productData) {
          setError("Product not found");
          return;
        }

        setProduct(productData);

        const [reviewsData, relatedData] = await Promise.all([
          productDetailsService.getReviews(),
          productDetailsService.getRelatedProducts(),
        ]);

        setReviews(reviewsData);
        setRelatedProducts(relatedData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch product details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  return {
    product,
    reviews,
    relatedProducts,
    loading,
    error,
  };
}
