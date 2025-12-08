'use client';

import { useState, useEffect, useCallback } from 'react';
import { Order, OrdersResponse } from '../types/order';
import { orderService } from '../services/order.service';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [prevCursor, setPrevCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const fetchOrders = useCallback(async (cursor?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await orderService.getMyOrders(cursor);
      
      // Ensure data is an array
      const ordersData = Array.isArray(response.data) ? response.data : [];
      setOrders(ordersData);
      setNextCursor(response.cursor?.next);
      setPrevCursor(response.cursor?.prev);
      setHasMore(response.hasMore || false);
      setCurrentCursor(cursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      console.error('[useOrders] Error:', err);
      // Set empty array on error
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const goToNextPage = useCallback(() => {
    if (nextCursor && !isLoading) {
      fetchOrders(nextCursor);
    }
  }, [nextCursor, isLoading, fetchOrders]);

  const goToPrevPage = useCallback(() => {
    if (prevCursor && !isLoading) {
      fetchOrders(prevCursor);
    }
  }, [prevCursor, isLoading, fetchOrders]);

  const refresh = useCallback(() => {
    orderService.clearCache();
    fetchOrders(currentCursor);
  }, [currentCursor, fetchOrders]);

  return {
    orders,
    isLoading,
    error,
    hasMore,
    hasPrev: !!prevCursor,
    goToNextPage,
    goToPrevPage,
    refresh,
  };
};
