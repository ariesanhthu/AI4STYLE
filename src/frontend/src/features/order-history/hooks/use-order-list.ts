"use client";
import { useState, useEffect } from "react";
import { useOrders } from "./use-orders";

export function useOrderList() {
  const { orders, loading, nextCursor, fetchOrders } = useOrders();
  const [cursorStack, setCursorStack] = useState<string[]>([]);
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchOrders({ limit: "10" });
  }, [fetchOrders]);

  const handleNextPage = () => {
    if (nextCursor) {
      setCursorStack((prev) => [...prev, currentCursor || "initial"]);
      setCurrentCursor(nextCursor);
      fetchOrders({ cursor: nextCursor, limit: "10" });
    }
  };

  const handlePrevPage = () => {
    if (cursorStack.length > 0) {
      const prevCursor = cursorStack[cursorStack.length - 1];
      const newStack = cursorStack.slice(0, -1);

      setCursorStack(newStack);
      setCurrentCursor(prevCursor === "initial" ? undefined : prevCursor);

      fetchOrders({
        cursor: prevCursor === "initial" ? undefined : prevCursor,
        limit: "10"
      });
    }
  };

  return {
    orders,
    loading,
    hasNextPage: !!nextCursor,
    hasPrevPage: cursorStack.length > 0,
    handleNextPage,
    handlePrevPage,
  };
}
