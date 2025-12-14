"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OrderList } from "./order-list";
import { useOrderList } from "../hooks/use-order-list";

export function OrderHistoryPage() {
  const {
    orders,
    loading,
    hasNextPage,
    hasPrevPage,
    handleNextPage,
    handlePrevPage
  } = useOrderList();

  return (
    <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Lịch sử đơn hàng</h1>
          <p className="text-muted-foreground">
            Xem và theo dõi các đơn hàng đã đặt
          </p>
        </div>

        <OrderList
          orders={orders}
          isLoading={loading}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />
    </div>
  );
}
