"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BannerSlide } from "@/components/home/BannerSlide";
import { ChatbotFAB } from "@/components/home/ChatbotFAB";
import { useHomeProducts } from "../hooks/use-home-products";
import { ProductCarousel } from "./product-carousel";

export function HomePage() {
  const { bestSellers, newestProducts, loading } = useHomeProducts();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Banner Slide */}
        <BannerSlide />

        {/* Best Selling Products Section */}
        <section className="container mx-auto px-4 py-8">
          <ProductCarousel title="Sản phẩm bán chạy nhất" products={bestSellers} />
        </section>

        {/* New Products Section */}
        <section className="container mx-auto px-4 py-8 bg-muted/30">
          <ProductCarousel title="Sản phẩm mới" products={newestProducts} />
        </section>
      </main>

      <Footer />

      {/* Chatbot FAB - Fixed at bottom right */}
      <ChatbotFAB />
    </div>
  );
}
