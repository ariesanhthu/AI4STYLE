"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  {
    id: 1,
    title: "Summer Collection 2025",
    description: "Khám phá xu hướng thời trang mùa hè mới nhất",
    image: "/banner-1.jpg", // Placeholder
    cta: "Mua ngay",
    link: "/shop",
  },
  {
    id: 2,
    title: "AI Virtual Try-On",
    description: "Thử đồ ảo với công nghệ AI tiên tiến",
    image: "/banner-2.jpg", // Placeholder
    cta: "Trải nghiệm",
    link: "/vton",
  },
  {
    id: 3,
    title: "Sale 50% - Limited Time",
    description: "Giảm giá lên đến 50% cho tất cả sản phẩm",
    image: "/banner-3.jpg", // Placeholder
    cta: "Xem ngay",
    link: "/shop",
  },
];

export function BannerSlide() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            
            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
              <div className="max-w-2xl text-white space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="text-xl lg:text-2xl text-white drop-shadow-md">
                  {slide.description}
                </p>
                <a
                  href={slide.link}
                  className="inline-block bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl"
                >
                  {slide.cta}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white backdrop-blur-sm text-purple-600 p-3 rounded-full transition-all shadow-lg"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white backdrop-blur-sm text-purple-600 p-3 rounded-full transition-all shadow-lg"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-8 shadow-lg"
                : "bg-white/70 hover:bg-white w-3"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
