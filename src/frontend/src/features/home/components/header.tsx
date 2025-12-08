"use client";

import Link from "next/link";
import { AuthStatus } from "@/features/auth-management";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-brand-primary">
            AI4STYLE
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-brand-primary">
            Trang chủ
          </Link>
          <Link
            href="/products"
            className="transition-colors hover:text-brand-primary"
          >
            Cửa hàng
          </Link>
          <Link
            href="/vton"
            className="transition-colors hover:text-brand-primary"
          >
            Thử đồ ảo
          </Link>
          <Link
            href="/chatbot"
            className="transition-colors hover:text-brand-primary"
          >
            Chat AI
          </Link>
        </nav>

        {/* Auth Status */}
        <AuthStatus />
      </div>
    </header>
  );
}
