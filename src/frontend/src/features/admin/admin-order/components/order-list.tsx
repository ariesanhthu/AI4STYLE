"use client";

import { Order } from "../types";
import { OrderItem } from "./order-item";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  nextCursor: string | null;
  onNextPage: () => void;
  onPrevPage: () => void;
  canPrev: boolean;
  onView: (order: Order) => void;
  onDelete: (order: Order) => void;
}

export function OrderList({
  orders,
  loading,
  nextCursor,
  onNextPage,
  onPrevPage,
  canPrev,
  onView,
  onDelete
}: OrderListProps) {
  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 min-h-[500px]">
        {orders.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground border rounded-2xl border-dashed">
            No orders found.
          </div>
        ) : (
          orders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              onView={onView}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      <div className="admin-pagination flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevPage}
          disabled={!canPrev || loading}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={!nextCursor || loading}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
