"use client";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-primary">
      <div className="container mx-auto px-4">
        <div className="relative h-[300px] md:h-[400px] flex items-center justify-center">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Content */}
          <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Thời trang thông minh với AI
            </h1>
            <p className="text-base md:text-lg text-white/90">
              Thử đồ ảo, tư vấn phong cách, mua sắm thông minh
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
