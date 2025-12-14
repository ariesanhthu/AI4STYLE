"use client";

import { AuthProvider } from "@/features/auth-management";
import { CartProvider } from "@/features/user-cart/context/cart-context";

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
}
