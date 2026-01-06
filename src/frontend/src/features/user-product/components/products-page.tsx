"use client";

import { useEffect, useState } from "react";
import { useProducts } from "../hooks/use-products";
import { productService } from "../services/product.service";
import { Category } from "../types/category";
import { ProductsSidebar } from "./side-bar/products-sidebar";
import { ProductSection } from "./product-section";

// KHÓA LOOP: Đưa object cấu hình ra ngoài để giữ nguyên tham chiếu (Reference)
const HOOK_CONFIG = { limit: "8" };

export function ProductsPage() {
  const {
    products,
    loading,
    isLoadingMore,
    total,
    filters,
    hasMore,
    loadMore,
    updateFilters,
    clearFilters,
  } = useProducts(HOOK_CONFIG);

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories();
        if (isMounted) setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full lg:w-64 shrink-0">
          <ProductsSidebar
            categories={categories}
            filters={filters}
            onUpdateFilters={updateFilters}
            onClearFilters={clearFilters}
          />
        </aside>

        <main className="flex-1">
          <ProductSection
            products={products}
            loading={loading}
            isLoadingMore={isLoadingMore}
            total={total}
            filters={filters}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onUpdateFilters={updateFilters}
          />
        </main>
      </div>
    </div>
  );
}