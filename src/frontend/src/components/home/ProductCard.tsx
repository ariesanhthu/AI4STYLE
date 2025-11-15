"use client";

import Image from "next/image";
import Link from "next/link";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-medium hover:border-brand-medium">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-gradient-to-br from-brand-light to-brand-light overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-medium to-brand-medium flex items-center justify-center">
            <span className="text-gray-400 text-sm font-medium">Product Image</span>
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-brand-to/0 group-hover:bg-brand-to/10 transition-colors duration-300" />
          
          {/* Quick actions on hover */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-white text-brand-to px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-light transition-colors shadow-lg">
              Quick View
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-brand-to transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          {product.category && (
            <p className="text-xs text-brand-to uppercase font-medium tracking-wide">{product.category}</p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold bg-gradient-to-r from-brand-from to-brand-to bg-clip-text text-transparent">
              ${product.price.toFixed(2)}
            </span>
            
            {product.rating && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <span className="text-sm text-gray-600 font-medium">{product.rating}</span>
              </div>
            )}
          </div>

          {/* Add to cart button */}
          <button className="w-full bg-gradient-to-r from-brand-from to-brand-to text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm shadow-md">
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
