"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "../types/product";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const discount =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  return (
    <Link href={`/products/${product.id}`}>
      <Card
        className={cn(
          "group overflow-hidden transition-all hover:shadow-lg",
          className
        )}
      >
        <CardHeader className="relative p-0 aspect-square">
          {discount > 0 && (
            <Badge className="absolute top-3 left-3 z-10 bg-red-500">
              -{discount}%
            </Badge>
          )}
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <p className="text-sm text-muted-foreground uppercase">
            {product.brand}
          </p>
          <h3 className="font-semibold line-clamp-2 min-h-12">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {product.price.toLocaleString()}đ
            </span>
            {discount > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {product.originalPrice.toLocaleString()}đ
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-yellow-500">★</span>
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
