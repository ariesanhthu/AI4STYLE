import { Product } from "../../user-product/types/product";
import { ProductCard } from "../../user-product/components/product-card";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
}
