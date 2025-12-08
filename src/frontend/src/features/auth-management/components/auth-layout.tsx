"use client";

import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image/Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Logo */}
        <Link href="/" className="absolute top-8 left-8 z-10">
          <span className="text-3xl font-bold text-primary-foreground drop-shadow-lg">
            AI4STYLE
          </span>
        </Link>

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-white">
          <div className="max-w-md text-center space-y-6">
            {/* Fashion illustration or logo */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl font-bold leading-tight">
              Thời trang thông minh với AI
            </h1>
            <p className="text-lg text-white/90">
              Thử đồ ảo, tư vấn phong cách, và mua sắm thông minh cùng AI4STYLE
            </p>

            {/* Features */}
            <div className="mt-12 space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Thử đồ ảo với công nghệ AI</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Tư vấn phong cách cá nhân hóa</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Mua sắm tiện lợi và nhanh chóng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden block text-center mb-8">
            <span className="text-3xl font-bold text-primary">
              AI4STYLE
            </span>
          </Link>

          {title && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground">{title}</h2>
              {description && (
                <p className="mt-2 text-muted-foreground">{description}</p>
              )}
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
