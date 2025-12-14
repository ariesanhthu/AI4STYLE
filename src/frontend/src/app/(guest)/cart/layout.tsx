"use client";

import { ReactNode } from "react";

interface CartLayoutProps {
  children: ReactNode;
}

export default function CartLayout({ children }: CartLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {children}
    </div>
  );
}
