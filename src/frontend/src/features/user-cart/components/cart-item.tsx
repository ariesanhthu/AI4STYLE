import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import { ProductVariant } from "@/features/user-product/types/product";
import { getColorName } from "@/lib/color-mapping";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CartItem as CartItemType } from "@/features/user-cart/context/cart-context";

interface CartItemProps {
  item: CartItemType;
  isMini?: boolean;
  onUpdateQuantity?: (
    productId: string,
    variantId: string | undefined,
    quantity: number
  ) => void;
  onUpdateVariant?: (
    productId: string,
    currentVariantId: string | undefined,
    newVariantId: string
  ) => void;
  onRemove?: (productId: string, variantId?: string) => void;
  formatPrice: (price: number) => string;
}

export function CartItem({
  item,
  isMini = false,
  onUpdateQuantity,
  onUpdateVariant,
  onRemove,
  formatPrice,
}: CartItemProps) {
  const { product, quantity, selectedVariantId } = item;
  const variant = product.variants?.find(
    (v: ProductVariant) => v.variantId === selectedVariantId
  );
  const displayPrice = variant
    ? variant.newPrice ?? variant.price
    : product.newPrice ?? product.price ?? 0;

  const displaySubtotal = displayPrice * quantity;

  // Mini Version (for checkout summary)
  if (isMini) {
    return (
      <div className="flex gap-3 text-sm">
        <div className="relative h-12 w-12 rounded border bg-gray-50 shrink-0">
          <Image
            src={product.thumbnail || "/no-image.png"}
            alt={product.name}
            fill
            className="object-cover rounded"
          />
          <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            {quantity}
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="truncate font-medium">{product.name}</p>
          <p className="text-gray-500 text-xs">
            {getColorName(product.color)} - {variant?.size}
          </p>
        </div>
        <div className="font-semibold">{formatPrice(displaySubtotal)}</div>
      </div>
    );
  }

  // Full Version (for cart page)
  return (
    <motion.div
      layout
      className="flex gap-4 rounded-lg border bg-white p-4 shadow-sm"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-gray-100">
        <Image
          src={product.thumbnail || "/no-image.png"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-medium text-gray-900 line-clamp-1">
              <Link
                href={`/products/${product.slug}?id=${product.optionId}`}
                className="hover:underline hover:text-primary text-lg"
              >
                {product.name}
              </Link>
            </h3>
            <p className="font-bold text-gray-900 shrink-0 text-lg">
              {formatPrice(displaySubtotal)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-wrap items-center gap-8">
            {/* Quantity */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Số lượng:</span>
              <div className="flex items-center gap-3 rounded-md border bg-gray-50 px-2 py-1">
                <button
                  className="p-1 text-gray-600 hover:text-black disabled:opacity-50"
                  onClick={() =>
                    onUpdateQuantity?.(
                      product.optionId,
                      selectedVariantId,
                      quantity - 1
                    )
                  }
                  disabled={quantity <= 1}
                  title="Giảm số lượng"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="text-sm font-medium w-4 text-center">
                  {quantity}
                </span>
                <button
                  className="p-1 text-gray-600 hover:text-black disabled:opacity-50"
                  onClick={() =>
                    onUpdateQuantity?.(
                      product.optionId,
                      selectedVariantId,
                      quantity + 1
                    )
                  }
                  disabled={quantity >= (variant?.stockQuantity ?? 10)}
                  title="Tăng số lượng"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              {variant && quantity >= variant.stockQuantity && (
                <span className="text-xs text-red-500">
                  (Còn {variant.stockQuantity})
                </span>
              )}
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Loại:</span>
                <Select
                  value={selectedVariantId}
                  onValueChange={(val) =>
                    onUpdateVariant?.(product.optionId, selectedVariantId, val)
                  }
                >
                  <SelectTrigger className="h-8 w-[100px] text-sm px-2">
                    <SelectValue placeholder="Size">
                      {variant ? `Size ${variant.size}` : "Size"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {[...product.variants]
                      .sort((a, b) => {
                        const sizeOrder: Record<string, number> = {
                          XS: 0,
                          S: 1,
                          M: 2,
                          L: 3,
                          XL: 4,
                          XXL: 5,
                          XXXL: 6,
                        };
                        const orderA = sizeOrder[a.size] || 99;
                        const orderB = sizeOrder[b.size] || 99;
                        return orderA - orderB;
                      })
                      .map((v) => (
                        <SelectItem
                          key={v.variantId}
                          value={v.variantId}
                          disabled={!v.inStock}
                        >
                          Size {v.size}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <button
            onClick={() => onRemove?.(product.optionId, selectedVariantId)}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 ml-4"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Xóa</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
