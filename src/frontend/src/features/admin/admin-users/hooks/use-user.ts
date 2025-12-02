"use client";

import { useState, useCallback, useRef } from 'react';
import { userService } from '../services/user.service';
import { User } from '../types/user.type';

const PAGE_LIMIT = 5;

export function useUsers() {
  const [staffs, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Cache to store pages: cursor -> staffs
  const cache = useRef<Map<string | null, { items: User[]; nextCursor: string | null }>>(new Map());
  // Keep track of page order for cache eviction or simple history
  const pageHistory = useRef<(string | null)[]>([]);

  const fetchUsers = useCallback(async (params: { cursor?: string; limit?: string; type?: string } = {}) => {
    const cursorKey = `${params.cursor || 'null'}-${params.type || 'admin'}`;

    // Check cache first
    if (cache.current.has(cursorKey)) {
      const cachedData = cache.current.get(cursorKey)!;
      setUsers(cachedData.items);
      setNextCursor(cachedData.nextCursor);
      return;
    }

    setLoading(true);
    try {
      const response = await userService.getList({
        cursor: params.cursor,
        limit: params.limit || '10',
        type: params.type,
      });

      const newItems = response.items;
      const newNextCursor = response.nextCursor;

      setUsers(newItems);
      setNextCursor(newNextCursor);

      // Update cache
      if (cache.current.size >= PAGE_LIMIT) {
        // Remove the oldest accessed page (FIFO for simplicity here)
        const firstKey = pageHistory.current.shift();
        if (firstKey !== undefined) {
          cache.current.delete(firstKey);
        }
      }
      cache.current.set(cursorKey, { items: newItems, nextCursor: newNextCursor });
      pageHistory.current.push(cursorKey);

    } catch (error) {
      console.error("Failed to fetch staffs:", error);
      // Handle error (maybe set error state)
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    cache.current.clear();
    pageHistory.current = [];
    fetchUsers();
  }, [fetchUsers]);

  return {
    staffs,
    loading,
    nextCursor,
    fetchUsers,
    refresh,
  };
}
