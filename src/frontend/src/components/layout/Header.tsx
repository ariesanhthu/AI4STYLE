"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth-management";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, User, ShoppingBag, LogOut, UserStar } from "lucide-react";

export function Header() {
  const { user, signOut, isAdmin } = useAuth();
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
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-primary font-bold text-xl">AI4STYLE</span>
          </Link>

          {/* Navigation - Right */}
          <nav className="flex items-center space-x-8">
            <Link
              href="/products"
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 text-foreground/70 hover:text-primary transition-colors focus:outline-none">
                    <Avatar className="h-8 w-8 bg-primary">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                        {user.name?.charAt(0).toUpperCase() ||
                          user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden sm:inline">
                      {user.name || "Tài khoản"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="flex items-center cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Xem thông tin</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/orders-history"
                      className="flex items-center cursor-pointer"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span>Lịch sử đơn hàng</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin"
                        className="flex items-center cursor-pointer"
                      >
                        <UserStar className="mr-2 h-4 w-4" />
                        <span>Quản lý</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/login">Đăng nhập</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
