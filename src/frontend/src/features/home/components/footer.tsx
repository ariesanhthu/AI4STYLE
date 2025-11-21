"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-brand-from to-brand-to bg-clip-text text-transparent">
              AI4STYLE
            </Link>
            <p className="text-sm text-gray-600">
              Thời trang thông minh với công nghệ AI
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Sản phẩm</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/shop" className="hover:text-brand-to">
                  Cửa hàng
                </Link>
              </li>
              <li>
                <Link href="/vton" className="hover:text-brand-to">
                  Thử đồ ảo
                </Link>
              </li>
              <li>
                <Link href="/chatbot" className="hover:text-brand-to">
                  Tư vấn AI
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/help" className="hover:text-brand-to">
                  Trợ giúp
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-to">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-to">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Pháp lý</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/privacy" className="hover:text-brand-to">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-to">
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} AI4STYLE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
