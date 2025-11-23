"use client";

import { ProductsSideBar } from "@/features/user-product/components/side-bar";
import { ProductSection } from "@/features/user-product/components/product-section";

export default function ProductsPage() {
  return (
    <>
      <div className="flex flex-1">
        <ProductsSideBar className="w-64" />

        <main className="flex-1 p-6">
          <ProductSection useDummyData={true} />
        </main>
      </div>
    </>
  );
}
