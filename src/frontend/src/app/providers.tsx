"use client";

import { AuthProvider } from "@/features/auth-management";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
