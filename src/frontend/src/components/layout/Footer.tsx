"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">
              AI4STYLE
            </h3>
            <p className="text-sm text-muted-foreground">
              Điểm đến thời trang và phong cách được hỗ trợ bởi AI.
            </p>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4">Liên kết</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cửa hàng
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4">Dịch vụ khách hàng</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Đổi trả
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: info@ai4style.com</li>
              <li>Điện thoại: +84 123 456 789</li>
              <li>Thành phố Hồ Chí Minh, Việt Nam</li>
            </ul>
          </div>
        </div>

              {/* Copyright */}
      <div className="border-t border-border py-6">
        <div className="container mx-auto px-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 AI4STYLE. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
      </div>
    </footer>
  );
}
