import Link from "next/link";
import Image from "next/image";
import { Product } from "../types/product";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/features/user-cart/context/cart-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const discount = product.hasDiscount ? product.discountPercentage : 0;

  return (
    <div className="group relative rounded-lg border bg-white p-2 transition-shadow hover:shadow-md">
      <div className="aspect-square overflow-hidden rounded-md bg-gray-100 relative">
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault(); // Prevent navigation
            e.stopPropagation(); // Prevent bubbling to parent Link
            addToCart(product, product.variants[0]?.variantId);
          }}
          className="absolute right-2 top-2 rounded-full bg-white/80 p-2 text-gray-600 opacity-0 transition-all hover:scale-110 group-hover:opacity-100 shadow-sm z-20"
          title="Thêm vào giỏ hàng"
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 space-y-1 px-1">
        <h3 className="flex flex-col gap-2 text-sm font-medium text-gray-900 line-clamp-2 min-h-10">
          <Link
            href={{
              pathname: `/products/${product.slug}`,
              query: { id: product.optionId },
            }}
          >
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center justify-end gap-2">
          {product.hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product.price)}
            </span>
          )}
          <span className="font-bold text-brand-primary">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product.newPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
