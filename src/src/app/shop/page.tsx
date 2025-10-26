'use client';

import { ProductSection } from '@/features/product-management';

export default function ShopPage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Cửa hàng</h1>
        <p className="text-muted-foreground text-lg">
          Khám phá bộ sưu tập sản phẩm đa dạng của chúng tôi
        </p>
      </div>

      <ProductSection />
    </main>
  );
}
