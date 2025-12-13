import { apiClient } from "../../../lib/open-api-client";
import { FilterOptions } from "../types/filter";
import { Product } from "../types/product";
import { Category } from "../types/category";
import { paths } from "../../../lib/open-api-client";

type ProductOptionsPath = "/shop/v1/client/products/options";
type ProductQuery = paths[ProductOptionsPath]["get"]["parameters"]["query"];
type ProductResponse =
  paths[ProductOptionsPath]["get"]["responses"][200]["content"]["application/json"];
type ProductItem = ProductResponse["data"]["items"][number];

type CategoryTreePath = "/shop/v1/client/category/tree";

type BestSellersPath = "/shop/v1/client/products/best-sellers";

// Helper to sanitize image URL
const getValidImageUrl = (url?: string | null) => {
  if (!url || url.includes("example.com")) {
    return "/no-image.png";
  }
  return url;
};

export const productService = {
  getProducts: async (
    filters?: FilterOptions
  ): Promise<{ data: Product[]; total: number; nextCursor?: string }> => {
    const query: ProductQuery = {
      limit: filters?.limit?.toString() || "12",
      cursor: filters?.cursor,
    };

    if (filters?.search) {
      query.search = filters.search;
    }

    if (filters?.minPrice !== undefined) {
      query.min_price = filters.minPrice.toString();
    }

    if (filters?.maxPrice !== undefined) {
      query.max_price = filters.maxPrice.toString();
    }

    if (filters?.sortOrder) {
      query.sortOrder = filters.sortOrder;
    }

    if (filters?.categoryId && filters.categoryId.length > 0) {
      query.category_id = filters.categoryId.join(",");
    }

    if (filters?.colorFamily && filters.colorFamily.length > 0) {
      query.color_family = filters.colorFamily.join(",");
    }

    const { data, error } = await apiClient.GET(
      "/shop/v1/client/products/options" as ProductOptionsPath,
      {
        params: {
          query,
        },
      }
    );

    if (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }

    const items = (data?.data?.items as ProductItem[]) || [];

    // Map API product to frontend Product type
    const mappedProducts: Product[] = items.map((item) => ({
      ...item,
      newPrice: item.newPrice ?? item.price,
      discountPercentage: item.discountPercentage ?? 0,
      thumbnail: getValidImageUrl(item.thumbnail),
      images: item.images?.map(getValidImageUrl) || [],
      variants:
        item.variants?.map((v) => ({
          ...v,
          newPrice: v.newPrice ?? v.price,
          displayPrice: v.newPrice ?? v.price,
          discountPercentage: v.discountPercentage ?? 0,
        })) || [],
    }));

    return {
      data: mappedProducts,
      total: items.length,
      nextCursor: data?.data?.nextCursor || undefined,
    };
  },

  getCategories: async (): Promise<Category[]> => {
    const { data, error } = await apiClient.GET(
      "/shop/v1/client/category/tree" as CategoryTreePath,
      {}
    );

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }

    return (data?.data as unknown as Category[]) || [];
  },

  getProductById: async (id: string): Promise<Product | null> => {
    const { data, error } = await apiClient.GET(
      `/shop/v1/client/products/options/${id}` as ProductOptionsPath,
      {}
    );

    if (error) {
      console.error("Error fetching product by id:", error);
      return null;
    }

    const item = data?.data as unknown as ProductItem;
    if (!item) return null;

    return {
      ...item,
      newPrice: item.newPrice ?? item.price,
      discountPercentage: item.discountPercentage ?? 0,
      thumbnail: getValidImageUrl(item.thumbnail),
      images: item.images?.map(getValidImageUrl) || [],
      variants:
        item.variants?.map((v) => ({
          ...v,
          newPrice: v.newPrice ?? v.price,
          displayPrice: v.newPrice ?? v.price,
          discountPercentage: v.discountPercentage ?? 0,
        })) || [],
    };
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    // Workaround: Use search to find product by slug
    try {
      const { data } = await productService.getProducts({ search: slug });
      // Find exact match if possible, or return first
      return data.find((p) => p.slug === slug) || data[0] || null;
    } catch (error) {
      console.error("Error finding product by slug:", error);
      return null;
    }
  },

  getBestSellers: async (): Promise<Product[]> => {
    const { data, error } = await apiClient.GET(
      "/shop/v1/client/products/best-sellers" as BestSellersPath,
      {}
    );

    if (error) {
      console.error("Error fetching best sellers:", error);
      return [];
    }

    // Explicitly cast or access safely
    const items = (data?.data?.items as unknown as ProductItem[]) || [];
    const mappedProducts: Product[] = items.map((item) => ({
      ...item,
      newPrice: item.newPrice ?? item.price,
      discountPercentage: item.discountPercentage ?? 0,
      thumbnail: getValidImageUrl(item.thumbnail),
      images: item.images?.map(getValidImageUrl) || [],
      variants:
        item.variants?.map((v) => ({
          ...v,
          newPrice: v.newPrice ?? v.price,
          displayPrice: v.newPrice ?? v.price,
          discountPercentage: v.discountPercentage ?? 0,
        })) || [],
    }));

    return mappedProducts;
  },
};
