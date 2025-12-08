"use client";

import { useEffect, useState } from "react";
import { useProducts } from "../hooks/use-products";
import { productService } from "../services/product.service";
import { Category } from "../types/category";
import { ProductsSidebar } from "./side-bar/products-sidebar";
import { ProductSection } from "./product-section";

export function ProductsPage() {
  const { products, loading, total, filters, updateFilters, clearFilters } =
    useProducts({ limit: 12 });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <ProductsSidebar
            categories={categories}
            filters={filters}
            onUpdateFilters={updateFilters}
            onClearFilters={clearFilters}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <ProductSection
            products={products}
            loading={loading}
            total={total}
            filters={filters}
            onUpdateFilters={updateFilters}
          />
        </main>
      </div>
    </div>
  );
}
