import { ProductVariant } from "../../user-product/types/product";
import { cn } from "@/lib/utils";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId?: string;
  onSelectVariant: (variantId: string) => void;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelectVariant,
}: VariantSelectorProps) {
  // Group variants by size for this specific UI implementation
  // In a real app, we might have multiple option types (size, color, material)
  // For now, based on mock data, we only have size variants per product color

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-900">Kích thước</h3>
        <div className="flex flex-wrap gap-3">
          {variants.map((variant) => (
            <button
              key={variant.variantId}
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
