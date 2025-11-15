"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { usePathname } from "next/navigation";

export function ProfileHeader() {
  const { user } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-white text-gray-900 border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl font-bold bg-gradient-to-r from-brand-from to-brand-to bg-clip-text text-transparent">
              AI4STYLE
            </span>
          </Link>

          {/* Navigation - Right */}
          <nav className="flex items-center space-x-8">
            <Link 
              href="/shop" 
              className={`text-sm font-medium transition-colors ${
                isActive('/shop') 
                  ? 'text-brand-to font-semibold' 
                  : 'text-gray-700 hover:text-brand-to'
              }`}
            >
              Product
            </Link>
            <Link 
              href="/about" 
              className={`text-sm font-medium transition-colors ${
                isActive('/about') 
                  ? 'text-brand-to font-semibold' 
                  : 'text-gray-700 hover:text-brand-to'
              }`}
            >
              About
            </Link>
            <Link 
              href="/cart" 
              className={`text-sm font-medium transition-colors flex items-center space-x-1 ${
                isActive('/cart') 
                  ? 'text-brand-to font-semibold' 
                  : 'text-gray-700 hover:text-brand-to'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Cart</span>
            </Link>

            {/* Profile - Highlighted when active */}
            {user ? (
              <Link 
                href="/profile" 
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  isActive('/profile')
                    ? 'bg-gradient-to-r from-brand-from to-brand-to text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                  isActive('/profile') 
                    ? 'bg-white/20' 
                    : 'bg-gradient-to-r from-brand-from to-brand-to text-white'
                }`}>
                  {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden sm:inline">
                  {user.name || 'Profile'}
                </span>
              </Link>
            ) : (
              <Link 
                href="/auth" 
                className="text-sm font-medium text-gray-700 hover:text-brand-to transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
