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
        {/* Hero Section */}
        <HeroSection />

        {/* Products Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sản phẩm nổi bật
            </h2>
            <p className="text-lg text-gray-600">
              Khám phá những món đồ thời trang được yêu thích nhất
            </p>
          </div>

          <ProductSection />
        </section>

        {/* CTA Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Bắt đầu trải nghiệm ngay hôm nay
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Đăng ký tài khoản để truy cập đầy đủ tính năng thử đồ ảo và tư vấn AI
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
