import { useState } from "react";
import { Product } from "../../user-product/types/product";
import { VariantSelector } from "./variant-selector";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useCart } from "@/features/user-cart/context/cart-context";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  // Hooks
  const { addToCart, cartItems } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<
    string | undefined
  >(product.variants[0]?.variantId);
  const [quantity, setQuantity] = useState(1);

  // Derived state
  const cartQuantity = cartItems
    .filter((item) => item.product.optionId === product.optionId)
    .reduce((acc, item) => acc + item.quantity, 0);

  const selectedVariant = product.variants.find(
    (v) => v.variantId === selectedVariantId
  );

  const price = selectedVariant ? selectedVariant.newPrice : product.newPrice;
  const originalPrice = selectedVariant ? selectedVariant.price : product.price;
  const hasDiscount = selectedVariant
    ? selectedVariant.hasDiscount
    : product.hasDiscount;

  // Handlers
  const maxStock = selectedVariant?.stockQuantity ?? 0;

  const incrementQuantity = () =>
    setQuantity((prev) => (prev < maxStock ? prev + 1 : prev));
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (selectedVariantId && quantity <= maxStock) {
      addToCart(product, selectedVariantId, quantity);
    }
  };

  const isOutOfStock = maxStock === 0;
  const isLowStock = !isOutOfStock && (selectedVariant?.lowStock ?? false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-3xl font-bold text-brand-primary">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(price || 0)}
          </span>
          {hasDiscount && (
            <span className="text-lg text-gray-500 line-through">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(originalPrice)}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {cartQuantity > 0 && (
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-md border border-blue-100 w-fit">
            <ShoppingCart className="h-4 w-4" />
            <span className="font-medium">
              Hiện đang có {cartQuantity} sản phẩm này trong giỏ hàng
            </span>
          </div>
        )}

        <VariantSelector
          variants={product.variants}
          selectedVariantId={selectedVariantId}
          onSelectVariant={(id) => {
            setSelectedVariantId(id);
            setQuantity(1); // Reset quantity on variant change
          }}
        />
      </div>

      <div className="flex gap-5 pt-6 border-t items-end">
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-medium text-gray-900">
            Số lượng
            {isOutOfStock ? (
              <span className="ml-2 text-red-600 font-bold">Hết hàng</span>
            ) : isLowStock ? (
              <span className="ml-2 text-yellow-600 font-bold">
                Sắp hết hàng (còn {maxStock})
              </span>
            ) : (
              <span className="ml-2 text-gray-500 text-xs">
                (Còn {maxStock})
              </span>
            )}
          </span>
          <div className="flex items-center rounded-md border border-input bg-background">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-none border-r"
              onClick={decrementQuantity}
              disabled={quantity <= 1 || isOutOfStock}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="w-16 text-center font-medium">{quantity}</div>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-none border-l"
              onClick={incrementQuantity}
              disabled={quantity >= maxStock || isOutOfStock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          className="flex-1 gap-3 h-12 text-md"
          size="lg"
          onClick={handleAddToCart}
          disabled={!selectedVariantId || isOutOfStock}
        >
          <ShoppingCart className="h-5 w-5" />
          {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
        </Button>
      </div>

      {product.otherOptions && product.otherOptions.length > 0 && (
        <div className="space-y-4 pt-6 border-t">
          <h3 className="text-sm font-medium text-gray-900">Chọn màu khác</h3>
          <div className="flex flex-wrap gap-2">
            {product.otherOptions.map((option) => (
              <Link
                href={`/products/${option.slug}?id=${option.optionId}`}
                key={option.optionId}
                className={cn(
                  "relative block h-16 w-16 overflow-hidden rounded-md transition-colors border-2",
                  option.optionId === product.optionId
                    ? "border-primary"
                    : "border-gray-200 hover:border-gray-400"
                )}
              >
                <Image
                  src={option.thumbnail || "/no-image.png"}
                  alt="Option thumbnail"
                  fill
                  className="object-cover"
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="prose prose-sm mt-8 text-gray-600">
        <h3 className="text-lg font-medium text-gray-900">Mô tả sản phẩm</h3>
        <p>
          {/* Mock description since it's not in the type yet */}
          Sản phẩm chất lượng cao, thiết kế thời trang, phù hợp với nhiều phong
          cách. Chất liệu thoáng mát, bền đẹp.
        </p>
      </div>
    </div>
  );
}
