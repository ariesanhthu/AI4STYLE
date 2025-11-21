"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-from via-brand-to to-brand-to py-20 md:py-32">
      <div className="absolute inset-0 bg-black/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 mb-6">
            <span className="text-sm font-medium">Công nghệ AI thế hệ mới</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Thời trang thông minh với AI
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Thử đồ ảo với công nghệ AI, nhận tư vấn phong cách cá nhân hóa, 
            và mua sắm thông minh cùng AI4STYLE
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" variant="outline" className="border-white text-brand-to hover:bg-white/10 font-semibold">
                Khám phá ngay
              </Button>
            </Link>
            <Link href="/vton">
              <Button size="lg" variant="outline" className="border-white text-brand-to hover:bg-white/10 font-semibold">
                Thử đồ ảo
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-6 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Thử đồ ảo AI</h3>
              <p className="text-sm text-white/80">Xem trước trang phục trên chính bạn</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Tư vấn AI</h3>
              <p className="text-sm text-white/80">Chat với AI để được tư vấn phong cách</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Mua sắm thông minh</h3>
              <p className="text-sm text-white/80">Tìm kiếm và mua sắm dễ dàng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
