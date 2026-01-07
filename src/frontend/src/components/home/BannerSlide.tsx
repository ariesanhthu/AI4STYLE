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
    image: "/banner1.png", // Placeholder
    cta: "Mua ngay",
    link: "/products",
    bgColor: "bg-blue-600",
  },
  {
    id: 2,
    title: "AI Virtual Try-On",
    description: "Thử đồ ảo với công nghệ AI tiên tiến",
    image: "/banner1.png", // Placeholder
    cta: "Trải nghiệm",
    link: "/vton",
    bgColor: "bg-blue-600",
  },
  {
    id: 3,
    title: "Sale 50% - Limited Time",
    description: "Giảm giá lên đến 50% cho tất cả sản phẩm",
    image: "/banner1.png", // Placeholder
    cta: "Xem ngay",
    link: "/products",
    bgColor: "bg-blue-600",
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
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              } ${slide.bgColor}`}
          >
            {/* Background Pattern/Overlay */}
            <div className="absolute inset-0 bg-black/10" />

            <div className="container mx-auto px-6 h-full flex items-center relative">
              {/* Text Content */}
              <div className={`w-full lg:w-1/2 text-white space-y-6 z-20 transition-all duration-700 delay-100 transform ${index === currentSlide ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
                }`}>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="text-xl lg:text-2xl text-white/90 drop-shadow-md max-w-lg">
                  {slide.description}
                </p>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="rounded-full font-bold px-8 h-12 shadow-xl hover:scale-105 transition-transform"
                >
                  <Link href={slide.link}>{slide.cta}</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Image Layer
      // <div className="absolute inset-0 z-20 pointer-events-none hidden lg:block">
      //   <div className="container mx-auto px-6 h-full relative">
      //     <div className="absolute right-0 bottom-0 top-0 w-1/2">
      //       {slides.map((slide, index) => (
      //         <div
      //           key={`img-${slide.id}`}
      //           className={`absolute inset-0 transition-all duration-1000 delay-300 transform ${index === currentSlide ? "translate-x-0 opacity-100 scale-100" : "translate-x-20 opacity-0 scale-95"
      //             }`}
      //         >
      //           <div className="relative w-full h-full">
      //             <Image
      //               src={slide.image}
      //               alt={slide.title}
      //               fill
      //               className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
      //               priority={index === 0}
      //             />
      //           </div>
      //         </div>
      //       ))}
      //     </div>
      //   </div>
      // </div> */}
      {/* Navigation Arrows */}
      <Button
        onClick={prevSlide}
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 text-white/50 hover:text-white hover:bg-white/10 rounded-full h-12 w-12"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        onClick={nextSlide}
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 text-white/50 hover:text-white hover:bg-white/10 rounded-full h-12 w-12"
        aria-label="Next slide"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide
              ? "bg-white w-8"
              : "bg-white/40 w-4 hover:w-6 hover:bg-white/60"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
