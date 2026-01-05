"use client";

import { useState, useCallback, useRef } from 'react';
import { orderService } from '../services/order.service';
import { GetListOrderDto, Order } from '../types';

const PAGE_LIMIT = 5;

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Cache to store pages: cursor -> orders
  const cache = useRef<Map<string | null, { items: Order[]; nextCursor: string | null }>>(new Map());
  const pageHistory = useRef<(string | null)[]>([]);

  const fetchOrders = useCallback(async (params: GetListOrderDto = {}) => {
    const cursorKey = `${params.cursor || 'null'}-${params.status || 'null'}-${params.type || 'null'}-${params.startDate || 'null'}-${params.endDate || 'null'}`;

    if (cache.current.has(cursorKey)) {
      const cachedData = cache.current.get(cursorKey)!;
      setOrders(cachedData.items);
      setNextCursor(cachedData.nextCursor);
      return;
    }

    setLoading(true);
    try {
      const response = await orderService.getList({
        limit: PAGE_LIMIT.toString(),
        ...params
      });

      const newItems = (response.items || []).map((item: any) => ({
        ...item,
        id: item.paymentId,
        code: item.orderId,
      }));
      const newNextCursor = response.nextCursor || null;

      setOrders(newItems);
      setNextCursor(newNextCursor);

      if (cache.current.size >= PAGE_LIMIT) {
        const firstKey = pageHistory.current.shift();
        if (firstKey !== undefined) {
          cache.current.delete(firstKey);
        }
      }
      cache.current.set(cursorKey, { items: newItems, nextCursor: newNextCursor });
      pageHistory.current.push(cursorKey);

    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    cache.current.clear();
    pageHistory.current = [];
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    nextCursor,
    fetchOrders,
    refresh,
  };
}
