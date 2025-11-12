"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

export function Header() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-brand-medium shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-from to-brand-to rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI4S</span>
            </div>
          </Link>

          {/* Navigation - Right */}
          <nav className="flex items-center space-x-8">
            <Link 
              href="/shop" 
              className="text-sm font-medium text-gray-700 hover:text-brand-to transition-colors"
            >
              Product
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium text-gray-700 hover:text-brand-to transition-colors"
            >
              About
            </Link>
            <Link 
              href="/cart" 
              className="text-sm font-medium text-gray-700 hover:text-brand-to transition-colors flex items-center space-x-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Cart</span>
            </Link>

            {/* SignIn/Profile */}
            {user ? (
              <Link 
                href="/profile" 
                className="flex items-center space-x-2 text-gray-700 hover:text-brand-to transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-brand-from to-brand-to rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden sm:inline">
                  {user.name || 'Profile'}
                </span>
              </Link>
            ) : (
              <Link 
                href="/auth" 
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-brand-from to-brand-to rounded-lg hover:opacity-90 transition-opacity"
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
