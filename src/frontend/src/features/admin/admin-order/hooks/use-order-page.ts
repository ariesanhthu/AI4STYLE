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

  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [sortDate, setSortDate] = useState<boolean>(true);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>([]);
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchOrders({
      search: searchQuery,
      // sort: sortDate ? 'createdAt,desc' : 'createdAt,asc' 
    });
  }, [fetchOrders, searchQuery, sortDate]);

  const handleSearch = (value: string) => {
    setSearchQuery(value || undefined);
  };

  const handleSortDateToggle = () => {
    setSortDate(prev => !prev);
    setCursorHistory([]);
    setCurrentCursor(undefined);
  }

  const handleNextPage = () => {
    if (nextCursor) {
      setCursorHistory((prev) => [...prev, currentCursor]);
      setCurrentCursor(nextCursor);
      fetchOrders({
        cursor: nextCursor,
        search: searchQuery
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
      search: searchQuery
    });
  };

  const handleRefresh = () => {
    refresh();
    setCursorHistory([]);
    setCurrentCursor(undefined);
  };

  const handleView = (order: Order) => {
    router.push(`/admin/orders/${order.id}`);
  };

  const handleDeleteClick = (order: Order) => {
    setOrderToDelete(order);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;

    setActionLoading(true);
    try {
      await orderService.delete(orderToDelete.id);
      setIsDeleteOpen(false);
      setOrderToDelete(null);
      handleRefresh();
      toast.success('Order deleted successfully');
    } catch (e) {
      toast.error("Failed to delete order");
    } finally {
      setActionLoading(false);
    }
  };

  return {
    orders,
    loading,
    nextCursor,
    searchQuery,
    sortDate,
    isDeleteOpen,
    setIsDeleteOpen,
    orderToDelete,
    actionLoading,
    refresh: handleRefresh,
    canPrev: cursorHistory.length > 0,
    handleSearch,
    handleSortDateToggle,
    handleNextPage,
    handlePrevPage,
    handleView,
    handleDeleteClick,
    handleConfirmDelete,
  };
}
