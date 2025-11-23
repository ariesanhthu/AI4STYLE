"use client";

import { Header } from "./header";
import { Footer } from "./footer";
import { HeroSection } from "./hero-section";
import { ProductSection } from "@/features/product-management";

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Banner */}
        <HeroSection />

        {/* Products Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Sản phẩm nổi bật
            </h2>
            <p className="text-gray-600">
              Khám phá những món đồ thời trang được yêu thích nhất
            </p>
          </div>

          <ProductSection />
        </section>
      </main>

      <Footer />
    </div>
  );
}
