import { ProductVariant } from "../../user-product/types/product";
import { cn } from "@/lib/utils";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId?: string;
  onSelectVariant: (variantId: string) => void;
}

import { useMemo } from "react";

const sizeOrder: Record<string, number> = {
  XS: 0,
  S: 1,
  M: 2,
  L: 3,
  XL: 4,
  XXL: 5,
  XXXL: 6,
};

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelectVariant,
}: VariantSelectorProps) {
  const sortedVariants = useMemo(() => {
    return [...variants].sort((a, b) => {
      const orderA = sizeOrder[a.size] ?? 999;
      const orderB = sizeOrder[b.size] ?? 999;
      return orderA - orderB;
    });
  }, [variants]);
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-900">Kích thước</h3>
        <div className="flex flex-wrap gap-3">
          {sortedVariants.map((variant) => (
            <button
              key={variant.variantId}
              type="button"
              onClick={() => onSelectVariant(variant.variantId)}
              disabled={!variant.inStock}
              className={cn(
                "min-w-12 rounded-md border px-3 py-2 text-sm font-medium transition-all",
                selectedVariantId === variant.variantId
                  ? "border-brand-primary bg-brand-primary text-white"
                  : "border-gray-200 bg-white text-gray-900 hover:border-gray-300",
                !variant.inStock && "cursor-not-allowed opacity-50"
              )}
            >
              {variant.size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
