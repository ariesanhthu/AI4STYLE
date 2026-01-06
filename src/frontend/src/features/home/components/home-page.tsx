"use client";

import { useEffect, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BannerSlide } from "@/components/home/BannerSlide";
// import { ChatbotFAB } from "@/components/home/ChatbotFAB";
import { useHomeProducts } from "../hooks/use-home-products";
import { ProductCarousel } from "./product-carousel";

export function HomePage() {
  const renderCount = useRef(0);
  const { bestSellers, newestProducts, loading, error } = useHomeProducts();

  useEffect(() => {
    renderCount.current += 1;
    console.log(`[HomePage] Render #${renderCount.current}`, {
      bestSellersCount: bestSellers.length,
      newestCount: newestProducts.length,
      loading,
      error,
    });
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Banner Slide */}
        <BannerSlide />

        {/* Error Display */}
        {error && (
          <div className="container mx-auto px-4 py-4">
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="container mx-auto px-4 py-8 text-center">
            <p>Đang tải sản phẩm...</p>
          </div>
        )}

        {/* Best Selling Products Section */}
        {!loading && (
          <section className="container mx-auto px-4 py-8">
            <ProductCarousel title="Sản phẩm bán chạy nhất" products={bestSellers} />
          </section>
        )}

        {/* New Products Section */}
        {!loading && (
          <section className="container mx-auto px-4 py-8 bg-muted/30">
            <ProductCarousel title="Sản phẩm mới" products={newestProducts} />
          </section>
        )}
      </main>

      <Footer />

      {/* Chatbot FAB - Fixed at bottom right */}
      {/* <ChatbotFAB /> */}
    </div>
  );
}
