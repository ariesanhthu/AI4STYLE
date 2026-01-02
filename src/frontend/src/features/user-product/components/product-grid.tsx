import { Product } from "../types/product";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
}

export function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-[300px] animate-pulse rounded-lg bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <p className="text-lg font-medium text-gray-900">
          Không tìm thấy sản phẩm nào
        </p>
        <p className="text-sm text-gray-500">
          Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={`${index}-${product.optionId}-${product.slug}`}
          product={product}
        />
      ))}
    </div>
  );
}
