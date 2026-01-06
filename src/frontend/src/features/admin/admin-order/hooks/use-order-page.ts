"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOrders } from "./use-order";
import { orderService } from "../services/order.service";
import { toast } from "sonner";
import { Order } from "../types";

export function useOrderPage() {
  const router = useRouter();
  const { orders, loading, nextCursor, fetchOrders, refresh } = useOrders();

  const [sortDate, setSortDate] = useState<boolean>(true);

  // New filters
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date } | undefined>(undefined);

  const [actionLoading, setActionLoading] = useState(false);

  const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>([]);
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchOrders({
      cursor: undefined,
      sortOrder: sortDate ? 'desc' : 'asc',
      status: status as any,
      type: type as any,
      startDate: dateRange?.from ? dateRange.from.toISOString() : undefined,
      endDate: dateRange?.to ? dateRange.to.toISOString() : undefined,
    });
  }, [fetchOrders, sortDate, status, type, dateRange]);

  const handleSortDateToggle = () => {
    setSortDate(prev => !prev);
    setCursorHistory([]);
    setCurrentCursor(undefined);
  }

  const handleStatusChange = (value: string) => {
    setStatus(value === "ALL" ? undefined : value);
    setCursorHistory([]);
    setCurrentCursor(undefined);
  }

  const handleTypeChange = (value: string) => {
    setType(value === "ALL" ? undefined : value);
    setCursorHistory([]);
    setCurrentCursor(undefined);
  }

  const handleDateRangeChange = (range: { from?: Date; to?: Date } | undefined) => {
    setDateRange(range);
    setCursorHistory([]);
    setCurrentCursor(undefined);
  }

  const handleNextPage = () => {
    if (nextCursor) {
      setCursorHistory((prev) => [...prev, currentCursor]);
      setCurrentCursor(nextCursor);
      fetchOrders({
        cursor: nextCursor,
        sortOrder: sortDate ? 'desc' : 'asc',
        status: status as any,
        type: type as any,
        startDate: dateRange?.from ? dateRange.from.toISOString() : undefined,
        endDate: dateRange?.to ? dateRange.to.toISOString() : undefined,
      });
    }
  };

  const handlePrevPage = () => {
    if (cursorHistory.length === 0) return;

    const newHistory = [...cursorHistory];
    const prevCursor = newHistory.pop();

    setCursorHistory(newHistory);
    setCurrentCursor(prevCursor);
    fetchOrders({
      cursor: prevCursor,
      sortOrder: sortDate ? 'desc' : 'asc',
      status: status as any,
      type: type as any,
      startDate: dateRange?.from ? dateRange.from.toISOString() : undefined,
      endDate: dateRange?.to ? dateRange.to.toISOString() : undefined,
    });
  };

  const handleRefresh = () => {
    refresh();
    setCursorHistory([]);
    setCurrentCursor(undefined);
  };

  const handleView = (order: Order) => {
    router.push(`/admin/orders/${order.orderId}`); // Use orderId (code) for URL
  };

  /* Delete logic removed as per new requirement */

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setActionLoading(true);
    try {
      if (newStatus === 'CANCELED') {
        await orderService.cancel(id); // id here is paymentId
        toast.success("Order canceled successfully");
      } else if (newStatus === 'REFUNDED') {
        await orderService.refund(id); // id here is paymentId
        toast.success("Order refunded successfully");
      }
      handleRefresh();
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  }

  return {
    orders,
    loading,
    nextCursor,
    sortDate,
    status,
    type,
    dateRange,
    actionLoading,
    refresh: handleRefresh,
    canPrev: cursorHistory.length > 0,
    handleSortDateToggle,
    handleStatusChange,
    handleTypeChange,
    handleDateRangeChange,
    handleNextPage,
    handlePrevPage,
    handleView,
    handleStatusUpdate
  };
}
