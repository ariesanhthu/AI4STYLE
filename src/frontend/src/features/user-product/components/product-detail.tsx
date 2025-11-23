"use client";

import Image from "next/image";
import { Loader } from "@/components/ui/loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { mockProducts } from "../mock/mockProducts";

interface ProductDetailProps {
  className?: string;
  id: string;
}

export const ProductDetail = ({ className, id }: ProductDetailProps) => {
  const products = mockProducts;
  const product = products.find((p) => p.id === id);
  const details = product || null;
  const isLoading = false;
  const error = null;

  if (!details) {
    return null;
  }

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
        <AlertDescription>Lỗi khi tải sản phẩm: {error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <section
      className={className + " flex flew-row gap-8 flex-col md:flex-row"}
    >
      <div className="mb-6">
        <Image
          src={details.imageUrl}
          alt={details.name}
          width={600}
          height={1800}
          className="h-auto max-h-96 object-cover rounded-md shadow-md"
        />
      </div>
      <div className="prose max-w-none space-y-8">
        <h1>{details.name}</h1>
        <p className="text-lg text-muted-foreground">Brand: {details.brand}</p>
        <p className="text-lg font-bold text-primary">
          Price: {details.price.toLocaleString()}đ
        </p>
        <h3 className="mt-4">Description:</h3>
        <p className="mt-4">{details.description}</p>
      </div>
    </section>
  );
};
