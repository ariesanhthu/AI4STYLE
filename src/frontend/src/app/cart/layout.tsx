"use client";

import { ReactNode } from "react";
import { Header } from "@/components/layout/Header";

interface CartLayoutProps {
  children: ReactNode;
}

export default function CartLayout({ children }: CartLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {children}
    </div>
  );
}
