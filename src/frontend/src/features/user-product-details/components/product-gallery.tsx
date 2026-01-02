import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto md:flex-col md:w-24">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={cn(
              "relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-3",
              selectedImage === index
                ? "border-primary"
                : "border-transparent hover:border-gray-200"
            )}
          >
            <Image
              src={image}
              alt={`Product image ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 md:flex-1">
        <Image
          src={images[selectedImage]}
          alt="Product main image"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
