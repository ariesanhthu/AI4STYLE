"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-brand-light to-brand-light border-t border-brand-medium">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-brand-from to-brand-to bg-clip-text text-transparent">
              AI4STYLE
            </h3>
            <p className="text-sm text-gray-600">
              Your destination for fashion and style powered by AI.
            </p>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-sm text-gray-600 hover:text-brand-to transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-brand-to transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-brand-to transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm text-gray-600 hover:text-brand-to transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-gray-600 hover:text-brand-to transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-gray-600 hover:text-brand-to transition-colors">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: info@ai4style.com</li>
              <li>Phone: +84 123 456 789</li>
              <li>Ho Chi Minh City, Vietnam</li>
            </ul>
          </div>
        </div>

              {/* Copyright */}
      <div className="border-t border-brand-medium py-6">
        <div className="container mx-auto px-6">
          <p className="text-center text-sm text-gray-600">
            © 2025 AI4STYLE. All rights reserved.
          </p>
        </div>
      </div>
      </div>
    </footer>
  );
}
