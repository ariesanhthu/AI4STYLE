"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    title: "Summer Collection 2025",
    description: "Khám phá xu hướng thời trang mùa hè mới nhất",
    image: "/banner-1.jpg", // Placeholder
    cta: "Mua ngay",
    link: "/products",
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
    link: "/products",
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
    <div className="relative w-full h-[500px] bg-primary overflow-hidden">
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
            <div className="relative z-10 container mx-auto px-6 h-full flex items-center pl-20">
              <div className="max-w-2xl text-white space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="text-xl lg:text-2xl text-white drop-shadow-md">
                  {slide.description}
                </p>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="rounded-full font-semibold shadow-lg hover:shadow-xl"
                >
                  <Link href={slide.link}>{slide.cta}</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        onClick={prevSlide}
        variant="secondary"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 backdrop-blur-sm rounded-full shadow-lg h-12 w-12"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        onClick={nextSlide}
        variant="secondary"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 backdrop-blur-sm rounded-full shadow-lg h-12 w-12"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <Button
            key={index}
            onClick={() => goToSlide(index)}
            variant="ghost"
            size="icon"
            className={`h-3 p-0 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-8 shadow-lg hover:bg-white"
                : "bg-white/70 hover:bg-white w-3"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
