"use client";

import { ReactNode } from "react";
import { ProductsNavbar } from "@/features/user-product/components/nav-bar";

interface ProductsLayoutProps {
  children: ReactNode;
}

export default function ProductsLayout({ children }: ProductsLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <ProductsNavbar />

      {children}
    </div>
  );
}
