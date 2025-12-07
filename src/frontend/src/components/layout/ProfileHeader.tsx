"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth-management";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export function ProfileHeader() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border backdrop-blur supports-[backdrop-filter]:bg-background/95">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl font-bold text-primary">
              AI4STYLE
            </span>
          </Link>

          {/* Navigation - Right */}
          <nav className="flex items-center space-x-8">
            <Link 
              href="/shop" 
              className={`text-sm font-medium transition-colors ${
                isActive('/shop') 
                  ? 'text-primary font-semibold' 
                  : 'text-foreground/70 hover:text-primary'
              }`}
            >
              Product
            </Link>
            <Link 
              href="/about" 
              className={`text-sm font-medium transition-colors ${
                isActive('/about') 
                  ? 'text-primary font-semibold' 
                  : 'text-foreground/70 hover:text-primary'
              }`}
            >
              About
            </Link>
            <Link 
              href="/cart" 
              className={`text-sm font-medium transition-colors flex items-center space-x-1 ${
                isActive('/cart') 
                  ? 'text-primary font-semibold' 
                  : 'text-foreground/70 hover:text-primary'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
            </Link>

            {/* Profile - Highlighted when active - Prevent hydration mismatch */}
            {mounted && user ? (
              <Button
                asChild
                variant={isActive('/profile') ? "default" : "ghost"}
              >
                <Link href="/profile" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={`font-semibold text-sm ${
                      isActive('/profile') 
                        ? 'bg-primary-foreground/20 text-primary-foreground' 
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline">
                    {user.name || 'Profile'}
                  </span>
                </Link>
              </Button>
            ) : (
              <Button asChild variant="ghost">
                <Link href="/auth">
                  Sign In
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
