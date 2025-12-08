"use client";

import { useProductDetails } from "../hooks/use-product-details";
import { ProductGallery } from "./product-gallery";
import { ProductInfo } from "./product-info";
import { ReviewSection } from "./review-section";
import { RelatedProducts } from "./related-products";

interface ProductDetailPageProps {
  slug: string;
}

export function ProductDetailPage({ slug }: ProductDetailPageProps) {
  const { product, reviews, relatedProducts, loading, error } =
    useProductDetails(slug);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="aspect-square rounded-lg bg-gray-100" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-gray-100" />
              <div className="h-6 w-1/4 rounded bg-gray-100" />
              <div className="h-32 rounded bg-gray-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto flex h-96 items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Không tìm thấy sản phẩm
          </h1>
          <p className="mt-2 text-gray-600">
            Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images} thumbnail={product.thumbnail} />
        <ProductInfo product={product} />
      </div>

      <div className="mt-16 space-y-16">
        <RelatedProducts products={relatedProducts} />
        <ReviewSection reviews={reviews} />
      </div>
    </div>
  );
}
