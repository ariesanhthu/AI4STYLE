"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Product } from "../hooks/use-product";

interface ProductItemProps {
  product: Product;
  onView: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductItem({ product, onView, onDelete }: ProductItemProps) {
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow rounded-2xl">
      <CardContent className="p-4 flex items-center gap-4">
        {/* Image */}
        <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100 shrink-0">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs">No Img</div>
          )}

        </div>

        {/* Name */}
        <div className="flex-1 min-w-0 flex items-center gap-4">
          <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
          <span className="font-medium truncate text-lg">{product.name}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* <div className="w-px h-8 bg-gray-200 hidden sm:block mr-2"></div> */}
          <Button variant="ghost" size="icon" className="hover:text-blue-600" onClick={() => onView(product)}>
            <Edit className="h-5 w-5" />
            <span className="sr-only">Edit</span>
          </Button>
          {/* <div className="w-px h-8 bg-gray-200 hidden sm:block"></div> */}
          <Button variant="ghost" size="icon" className="hover:text-red-600" onClick={() => onDelete(product)}>
            <Trash2 className="h-5 w-5" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
