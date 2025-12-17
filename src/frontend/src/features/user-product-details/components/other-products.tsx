import { Product } from "../../user-product/types/product";
import { ProductCard } from "../../user-product/components/product-card";

interface OtherProductsProps {
  products: Product[];
  sameColorProducts?: Product[];
}

export function OtherProducts({
  products,
  sameColorProducts = [],
}: OtherProductsProps) {
  if (products.length === 0 && sameColorProducts.length === 0) return null;

  return (
    <div className="space-y-12">
      {sameColorProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Sản phẩm cùng màu</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {sameColorProducts.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Sản phẩm bán chạy</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
