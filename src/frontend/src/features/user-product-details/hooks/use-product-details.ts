import { useState, useEffect, useRef } from "react";
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
  const [isChangingColor, setIsChangingColor] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const id = searchParams?.get("id");
  
  // Track last fetched identifiers để tránh fetch lại không cần thiết
  const lastFetchedId = useRef<string | null>(null);
  const lastFetchedSlug = useRef<string | null>(null);
  const reviewsFetched = useRef<boolean>(false);
  const otherProductsFetched = useRef<boolean>(false);
  const isInitialLoad = useRef<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug && !id) return;

      // Xác định identifier hiện tại
      const currentId = id || null;
      const currentSlug = slug || null;
      
      // Nếu đã fetch cùng product rồi thì skip
      if (currentId && currentId === lastFetchedId.current) {
        return;
      }
      if (!currentId && currentSlug && currentSlug === lastFetchedSlug.current) {
        return;
      }

      try {
        // Chỉ set loading khi initial load (chưa có product)
        // Khi đổi màu (đã có product), dùng isChangingColor để không làm UI chớp
        if (isInitialLoad.current) {
          setLoading(true);
        } else {
          setIsChangingColor(true);
        }
        let productData: Product | null = null;

        // Ưu tiên fetch bằng ID nếu có
        if (currentId) {
          productData = await productDetailsService.getProductById(currentId);
          if (productData) {
            lastFetchedId.current = currentId;
            lastFetchedSlug.current = null;
          }
        }

        // Fallback to slug if ID lookup failed or no ID
        if (!productData && currentSlug) {
          productData = await productDetailsService.getProduct(currentSlug);
          if (productData) {
            lastFetchedSlug.current = currentSlug;
            lastFetchedId.current = null;
          }
        }

        if (!productData) {
          setError("Product not found");
          setLoading(false);
          return;
        }

        setProduct(productData);

        // Fetch reviews và otherProducts chỉ một lần (không phụ thuộc vào product)
        const fetchPromises: Promise<any>[] = [];
        
        if (!reviewsFetched.current) {
          fetchPromises.push(
            productDetailsService.getReviews().then((data) => {
              setReviews(data);
              reviewsFetched.current = true;
            })
          );
        }

        if (!otherProductsFetched.current) {
          fetchPromises.push(
            productDetailsService.getOtherProducts().then((data) => {
              setOtherProducts(data);
              otherProductsFetched.current = true;
            })
          );
        }

        // Always fetch sameColorProducts vì nó phụ thuộc vào màu của product hiện tại
        const sameColorProductsPromise = productData.color
          ? productDetailsService.getSameColorProducts(productData.color)
          : Promise.resolve([]);

        // Fetch tất cả song song
        const [sameColorProductsData] = await Promise.all([
          sameColorProductsPromise,
          ...fetchPromises,
        ]);
        
        setSameColorProducts(sameColorProductsData);

        setError(null);
        isInitialLoad.current = false;
      } catch (err) {
        setError("Failed to fetch product details");
        console.error(err);
      } finally {
        setLoading(false);
        setIsChangingColor(false);
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
    isChangingColor,
    error,
  };
}
