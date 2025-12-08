"use client";

import { RequireAuth } from "@/features/auth-management";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OrderList } from "./order-list";

export function OrderHistoryPage() {
  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <Header />

        {/* Content */}
        <main className="flex-1 bg-muted/30">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">Lịch sử đơn hàng</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Xem và theo dõi tất cả đơn hàng của bạn
              </p>
            </div>
            <OrderList />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </RequireAuth>
  );
}
