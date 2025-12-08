"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BannerSlide } from "@/components/home/BannerSlide";
import { ChatbotFAB } from "@/components/home/ChatbotFAB";
import { ProductSection } from "@/features/product-management";

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Banner Slide */}
        <BannerSlide />

        {/* Best Selling Products Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
              Sản phẩm bán chạy nhất
            </h2>
            <p className="text-muted-foreground">
              Những sản phẩm được yêu thích và lựa chọn nhiều nhất
            </p>
          </div>

          <ProductSection />
        </section>

        {/* New Products Section */}
        <section className="container mx-auto px-4 py-12 bg-muted/30">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
              Sản phẩm mới
            </h2>
            <p className="text-muted-foreground">
              Khám phá những món đồ thời trang mới nhất
            </p>
          </div>

          <ProductSection />
        </section>
      </main>

      <Footer />
      
      {/* Chatbot FAB - Fixed at bottom right */}
      <ChatbotFAB />
    </div>
  );
}
