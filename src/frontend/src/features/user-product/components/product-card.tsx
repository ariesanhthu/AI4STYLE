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
  const discount = product.hasDiscount ? product.discountPercentage ?? 0 : 0;

  const hasVariants = product.variants && product.variants.length > 0;

  const totalStock = hasVariants
    ? product.variants.reduce((acc, v) => acc + v.stockQuantity, 0)
    : 0;

  const isOutOfStock = hasVariants
    ? product.outOfStock || totalStock === 0
    : product.outOfStock;

  const isLowStock =
    !isOutOfStock && hasVariants && product.variants.some((v) => v.lowStock);

  return (
    <div className="group relative flex h-full flex-col rounded-lg border bg-white p-2 transition-shadow hover:shadow-md">
      <div className="relative aspect-square w-full flex-none overflow-hidden rounded-md bg-gray-100">
        <Image
          src={product.thumbnail || "/no-image.png"}
          alt={product.name}
          fill
          className={`object-cover transition-transform group-hover:scale-105 ${
            isOutOfStock ? "opacity-60 grayscale" : ""
          }`}
        />
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1 items-start">
          {isOutOfStock && (
            <span className="rounded bg-gray-600 px-2 py-1 text-xs font-bold text-white">
              Hết hàng
            </span>
          )}
          {isLowStock && (
            <span className="rounded bg-yellow-500 px-2 py-1 text-xs font-bold text-white">
              Sắp hết hàng
            </span>
          )}
          {discount > 0 && (
            <span className="rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
              -{discount}%
            </span>
          )}
        </div>
        {!isOutOfStock && (
          <button
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation
              e.stopPropagation(); // Prevent bubbling to parent Link
              addToCart(product, product.variants?.[0]?.variantId);
            }}
            className="absolute right-2 top-2 z-20 rounded-full bg-white/80 p-2 text-gray-600 opacity-0 shadow-sm transition-all hover:scale-110 group-hover:opacity-100"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="mt-3 flex flex-1 flex-col px-1">
        <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900">
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
        <div className="mt-auto flex items-center justify-end gap-2">
          {product.hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product.price ?? 0)}
            </span>
          )}
          <span className="font-bold text-brand-primary">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product.newPrice ?? 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
