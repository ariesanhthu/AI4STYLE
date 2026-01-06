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
      limit: filters?.limit || "12",
      cursor: filters?.cursor,
    };

    if (filters?.search) {
      query.search = filters.search;
    }

    if (filters?.min_price) {
      query.min_price = filters.min_price;
    }

    if (filters?.max_price) {
      query.max_price = filters.max_price;
    }

    if (filters?.sortOrder) {
      query.sortOrder = filters.sortOrder;
    }

    if (filters?.sortOption) {
      query.sortOption = filters.sortOption;
    }

    if (filters?.category_id) {
      query.category_id = filters.category_id;
    }

    if (filters?.color_family) {
      query.color_family = filters.color_family;
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

    const items = (data?.data?.items as unknown as ProductItem[]) || [];

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
      otherOptions:
        item.relatedOptions?.map((o) => ({
          ...o,
          thumbnail: getValidImageUrl(o.thumbnail),
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
    if (!item) {
      console.warn("No product data returned for id:", id);
      return null;
    }

    // Debug: Log raw item to check if slug exists
    console.log("=== getProductById Debug ===");
    console.log("Product ID:", id);
    console.log("Raw item:", item);
    console.log("Item slug:", item.slug);
    console.log("Item optionId:", item.optionId);
    console.log("Item name:", item.name);
    console.log("===========================");

    const mappedProduct = {
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
      otherOptions:
        item.relatedOptions?.map((o) => ({
          ...o,
          thumbnail: getValidImageUrl(o.thumbnail),
        })) || [],
    };

    // Debug: Log mapped product to verify slug is preserved
    console.log("=== Mapped Product Debug ===");
    console.log("Mapped product slug:", mappedProduct.slug);
    console.log("Mapped product optionId:", mappedProduct.optionId);
    console.log("Mapped product name:", mappedProduct.name);
    console.log("============================");

    // Ensure slug exists, if not log warning
    if (!mappedProduct.slug) {
      console.error("WARNING: Product has no slug after mapping!", {
        id,
        optionId: mappedProduct.optionId,
        name: mappedProduct.name,
        rawItem: item,
      });
    }

    return mappedProduct;
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

    // Backend returns { items, nextCursor } wrapped in standard response format
    // Response interceptor wraps it in { data: { items, nextCursor } }
    const responseData = (data as any)?.data || data;
    const items = (responseData?.items as unknown as ProductItem[]) || [];
    
    console.log("[getBestSellers] Response:", {
      hasData: !!data,
      hasResponseData: !!responseData,
      itemsCount: items.length,
      rawData: data,
    });

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
      otherOptions:
        item.relatedOptions?.map((o) => ({
          ...o,
          thumbnail: getValidImageUrl(o.thumbnail),
        })) || [],
    }));

    return mappedProducts;
  },
};
