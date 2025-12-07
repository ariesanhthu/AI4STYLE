"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth-management";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/95">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-primary font-bold text-xl">AI4STYLE</span>
          </Link>

          {/* Navigation - Right */}
          <nav className="flex items-center space-x-8">
            <Link 
              href="/shop" 
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              Sản phẩm
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              Giới thiệu
            </Link>
            <Link 
              href="/cart" 
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors flex items-center space-x-1"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Giỏ hàng</span>
            </Link>

            {/* SignIn/Profile - Prevent hydration mismatch */}
            {mounted && user ? (
              <Link 
                href="/profile" 
                className="flex items-center space-x-2 text-foreground/70 hover:text-primary transition-colors"
              >
                <Avatar className="h-8 w-8 bg-primary">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:inline">
                  {user.name || 'Tài khoản'}
                </span>
              </Link>
            ) : (
              <Button asChild>
                <Link href="/auth">
                  Đăng nhập
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
