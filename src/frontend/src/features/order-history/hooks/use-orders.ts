'use client'
import { useState, useCallback, useRef } from "react";
import { orderService } from "../services/order.service";
import { Order, OrderGetMyOrdersParams, OrderGetMyOrdersResponse } from "../types/order.type";

const CACHE_LIMIT = 5;

// Define items type based on response
type OrderItem = Extract<OrderGetMyOrdersResponse['items'], any[]>[number];

export function useOrders() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Cache structure
  const cache = useRef<Map<string, { orders: OrderItem[]; nextCursor: string | null }>>(
    new Map()
  );
  const pageKeys = useRef<string[]>([]);

  const fetchOrders = useCallback(async (params?: OrderGetMyOrdersParams) => {
    setLoading(true);
    setError(null);

    const cursorKey = params?.cursor || 'initial';

    // Check cache
    if (cache.current.has(cursorKey)) {
      const cachedData = cache.current.get(cursorKey)!;
      setOrders(cachedData.orders);
      setNextCursor(cachedData.nextCursor);
      setLoading(false);
      return;
    }

    try {
      const data = await orderService.getMyOrders(params);
      setOrders(data.items);
      setNextCursor(data.nextCursor);

      // Update cache
      if (cache.current.size >= CACHE_LIMIT) {
        const firstKey = pageKeys.current.shift();
        if (firstKey) {
          cache.current.delete(firstKey);
        }
      }

      cache.current.set(cursorKey, { orders: data.items, nextCursor: data.nextCursor });
      pageKeys.current.push(cursorKey);

    } catch (err) {
      console.error(err);
      setError((err as Error).message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    cache.current.clear();
    pageKeys.current = [];
    fetchOrders({});
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    nextCursor,
    fetchOrders,
    refresh,
  };
}
