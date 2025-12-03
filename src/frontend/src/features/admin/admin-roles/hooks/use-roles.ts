'use client'

import { useState, useCallback, useRef } from 'react';
import { roleService } from '../services/role.service';
import { Role, RoleGetAllRequest, RoleErrorResponse } from '../types/role.type';

const CACHE_LIMIT = 5;

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(true);

  // Cache structure: Map<cursor | 'initial', { roles: Role[], nextCursor: string | null }>
  // using 'initial' key for the first page (where cursor is undefined)
  const cache = useRef<Map<string, { roles: Role[], nextCursor: string | null }>>(new Map());
  const pageKeys = useRef<string[]>([]); // To track order for LRU-like eviction if needed, or just FIFO

  const fetchRoles = useCallback(async (params?: RoleGetAllRequest) => {
    setLoading(true);
    setError(null);

    const cursorKey = params?.cursor || 'initial';

    // Check cache
    if (cache.current.has(cursorKey)) {
      const cachedData = cache.current.get(cursorKey)!;
      setRoles(cachedData.roles);
      setNextCursor(cachedData.nextCursor);
      setLoading(false);
      return;
    }

    try {
      const data = await roleService.getRoles(params);
      setRoles(data.items);
      setNextCursor(data.nextCursor);
      setIsAuthorized(true);

      // Update cache
      if (cache.current.size >= CACHE_LIMIT) {
        // Remove the oldest accessed or added. Simple FIFO for now:
        const firstKey = pageKeys.current.shift();
        if (firstKey) {
          cache.current.delete(firstKey);
        }
      }

      cache.current.set(cursorKey, { roles: data.items, nextCursor: data.nextCursor });
      pageKeys.current.push(cursorKey);

    } catch (err: unknown) {
      console.log(err)
      if ((err as RoleErrorResponse).code === 403) {
        setIsAuthorized(false);
      }
      setError((err as Error).message || 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    // Clear cache and fetch initial page
    cache.current.clear();
    pageKeys.current = [];
    fetchRoles({});
  }, [fetchRoles]);

  return {
    roles,
    loading,
    error,
    nextCursor,
    isAuthorized,
    fetchRoles,
    refresh
  };
}