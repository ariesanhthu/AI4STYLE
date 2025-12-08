import { FilterOptions } from "../types/filter";
import { Product } from "../types/product";
import { Category } from "../types/category";
import { mockProducts, mockCategories } from "../mock/products";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const productService = {
  getProducts: async (
    filters?: FilterOptions
  ): Promise<{ data: Product[]; total: number }> => {
    await delay(500);

    let filtered = [...mockProducts];

    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.search.includes(searchLower) ||
            p.name.toLowerCase().includes(searchLower)
        );
      }

      if (filters.categoryId && filters.categoryId.length > 0) {
        // Simplified check for mock data
      }

      if (filters.minPrice !== undefined) {
        filtered = filtered.filter((p) => p.newPrice >= filters.minPrice!);
      }

      if (filters.maxPrice !== undefined) {
        filtered = filtered.filter((p) => p.newPrice <= filters.maxPrice!);
      }

      if (filters.colorFamily && filters.colorFamily.length > 0) {
        filtered = filtered.filter((p) =>
          filters.colorFamily?.includes(p.colorFamily)
        );
      }
    }

    // Sort
    if (filters?.sortOrder) {
      filtered.sort((a, b) => {
        if (filters.sortOrder === "asc") return a.newPrice - b.newPrice;
        return b.newPrice - a.newPrice;
      });
    }

    return {
      data: filtered,
      total: filtered.length,
    };
  },

  getCategories: async (): Promise<Category[]> => {
    await delay(300);
    return mockCategories;
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    await delay(300);
    return mockProducts.find((p) => p.slug === slug) || null;
  },
};
