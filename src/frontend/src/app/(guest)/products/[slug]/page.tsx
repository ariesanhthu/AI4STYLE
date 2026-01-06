import { Suspense } from "react";
import { ProductDetailPage } from "@/features/user-product-details/components/product-detail-page";
import { Loader } from "@/components/ui/loader";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8" />
        </div>
      }
    >
      <ProductDetailPage slug={slug} />
    </Suspense>
  );
}
