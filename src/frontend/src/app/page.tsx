'use client';

import { ProductSection } from '@/features/product-management';
import { AuthStatus } from '@/components/auth/AuthStatus';

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      {/* Auth status bar */}
      <div className="flex justify-end mb-6">
        <AuthStatus />
      </div>

      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Clothing Store
        </h1>
        <p className="text-xl text-muted-foreground">
          Chat với AI giúp bạn phối đồ hoàn hảo
        </p>
      </div>

      <ProductSection />

      {/* Hero section cho featured products */}
      <section className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-8">
          Sản phẩm nổi bật
        </h2>
        <ProductSection />
      </section>
    </main>
  );
}
