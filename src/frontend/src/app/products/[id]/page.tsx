"use client";

import { useParams } from "next/navigation";
import { ProductDetail } from "@/features/user-product/components/product-detail";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return <ProductDetail id={id} useDummyData={true} className="p-6" />;
}
