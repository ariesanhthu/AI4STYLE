'use client';

import { useProducts } from '../hooks/use-products';
import { ProductGrid } from './product-grid';
import { Loader } from '@/components/ui/loader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ProductSectionProps {
  className?: string;
}

export const ProductSection = ({ className }: ProductSectionProps) => {
  const { products, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="h-8 w-8" />
        <span className="ml-3 text-muted-foreground">Đang tải sản phẩm...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Lỗi khi tải sản phẩm: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <section className={className}>
      <ProductGrid products={products} />
    </section>
  );
};
