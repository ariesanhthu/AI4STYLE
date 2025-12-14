"use client";

import { Product } from "../hooks/use-product";
import { ProductItem } from "./product-item";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface ProductListProps {
  products: Product[];
  loading: boolean;
  nextCursor: string | null;
  onNextPage: () => void;
  onPrevPage: () => void;
  canPrev: boolean;
  onView: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductList({
  products,
  loading,
  nextCursor,
  onNextPage,
  onPrevPage,
  canPrev,
  onView,
  onDelete
}: ProductListProps) {
  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 min-h-[500px]">
        {products.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground border rounded-2xl border-dashed">
            No products found.
          </div>
        ) : (
          products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              onView={onView}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      <div className="admin-pagination flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevPage}
          disabled={!canPrev || loading}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={!nextCursor || loading}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
