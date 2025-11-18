"use client";

import Link from "next/link";

interface ProductsNavbarProps {
  className?: string;
}
export const ProductsNavbar = ({ className }: ProductsNavbarProps) => {
  return (
    <nav
      className={
        className
          ? className
          : "w-full h-16 border-b bg-amber-100 flex items-center justify-between px-6 py-10"
      }
    >
      <div className="flex items-center">
        <svg
          className="h-8 w-8 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2" />
          <path
            d="M8 12L11 15L16 10"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h1 className="text-2xl font-bold">AI4STYLE</h1>
      </div>
      <div className={"flex space-x-10 mr-4"}>
        <Link
          href="/products"
          className="text-2xl font-medium text-amber-600 hover:font-bold hover:text-amber-800"
        >
          Product
        </Link>
        <Link
          href="/about"
          className="text-2xl font-medium hover:font-bold hover:text-amber-800"
        >
          About
        </Link>
        <Link
          href="/cart"
          className="text-2xl font-medium hover:font-bold hover:text-amber-800"
        >
          Cart
        </Link>
        <Link
          href="/profile"
          className="text-2xl font-medium hover:font-bold hover:text-amber-800"
        >
          Profile
        </Link>
      </div>
    </nav>
  );
};
