import { useState } from "react";
import { Product } from "../../user-product/types/product";
import { VariantSelector } from "./variant-selector";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { addToCart } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<
    string | undefined
  >(product.variants[0]?.variantId);

  const selectedVariant = product.variants.find(
    (v) => v.variantId === selectedVariantId
  );

  const price = selectedVariant ? selectedVariant.newPrice : product.newPrice;
  const originalPrice = selectedVariant ? selectedVariant.price : product.price;
  const hasDiscount = selectedVariant
    ? selectedVariant.hasDiscount
    : product.hasDiscount;

  const handleAddToCart = () => {
    if (selectedVariantId) {
      addToCart(product, selectedVariantId);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        <div className="mt-2 flex items-center gap-4">
          <span className="text-2xl font-bold text-brand-primary">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(price)}
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
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium text-gray-900">Màu sắc:</span>
          <span>{product.color}</span>
        </div>

        <VariantSelector
          variants={product.variants}
          selectedVariantId={selectedVariantId}
          onSelectVariant={setSelectedVariantId}
        />
      </div>

      <div className="flex gap-4 pt-6 border-t">
        <Button
          className="flex-1 gap-2"
          size="lg"
          onClick={handleAddToCart}
          disabled={!selectedVariantId}
        >
          <ShoppingCart className="h-5 w-5" />
          Thêm vào giỏ
        </Button>
      </div>

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
