"use client";

import { ReactNode } from "react";
import { Header } from "@/features/home/components/header";

interface ProductsLayoutProps {
  children: ReactNode;
}

export default function ProductsLayout({ children }: ProductsLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {children}
    </div>
  );
}
