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
  onStatusUpdate: (id: string, newStatus: string) => void;
}

export function OrderList({
  orders,
  loading,
  nextCursor,
  onNextPage,
  onPrevPage,
  canPrev,
  onView,
  onStatusUpdate,
}: OrderListProps) {
  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-lg bg-card text-muted-foreground shadow-sm">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading orders...</span>
      </div>
    );
  }

  if (!loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-card text-muted-foreground shadow-sm">
        <p className="text-lg font-medium">No orders found</p>
        <p className="text-sm">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <OrderItem
            key={order.id}
            order={order}
            onView={() => onView(order)}
            onStatusUpdate={onStatusUpdate}
          />
        ))}
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevPage}
            disabled={!canPrev || loading}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={!nextCursor || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
