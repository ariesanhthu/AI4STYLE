import { Suspense } from "react";
import { ProductsPage } from "@/features/user-product/components/products-page";
import { Loader } from "@/components/ui/loader";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8" />
        </div>
      }
    >
      <ProductsPage />
    </Suspense>
  );
}
