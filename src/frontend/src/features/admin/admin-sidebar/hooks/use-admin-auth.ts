"use client";

import { useState, useEffect, useCallback } from "react";
import { adminAuthService } from "../services/admin-auth.service";
import type { UserProfileResponse } from "../types/user.type";
import { SIDEBAR_ITEMS, SidebarItem } from "../types/sidebar.type";

interface UseAdminAuthReturn {
  user: UserProfileResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  sideBarContent: SidebarItem[] | null;
  refetch: () => Promise<void>;
  updateProfile: (data: Partial<UserProfileResponse>) => Promise<void>;
  logout: () => Promise<void>;
}
/**
 * Hook to manage admin authentication state
 * Fetches current user data and provides methods for profile management
 */
export function useAdminAuth(): UseAdminAuthReturn {
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [sideBarContent, setSideBarContent] = useState<SidebarItem[] | null>(null);

  /**
   * Fetch current user data
   */
  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      
      const userData = await adminAuthService.getCurrentUser();
      setUser(userData);
      if (!userData) {
        setSideBarContent(null);
      };
      const content = SIDEBAR_ITEMS.filter((item: SidebarItem) => userData?.role?.permissions.includes(item.permission));
      setSideBarContent(content);      
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch user");
      setIsError(true);
      setError(error);
      setUser(null);
      console.error("Failed to fetch admin user:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (data: Partial<UserProfileResponse>) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      
      const updatedUser = await adminAuthService.updateProfile(data);
      setUser(updatedUser);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to update profile");
      setIsError(true);
      setError(error);
      throw error; // Re-throw so caller can handle
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await adminAuthService.logout();
      setUser(null);
      
      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to logout");
      setIsError(true);
      setError(error);
      console.error("Failed to logout:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // const buildSideBarContent = useCallback(() => {
  //   console.log("Build sidebar content")
  //   if (!user) return null;
    
  //   const content = SIDEBAR_ITEMS.filter((item: SidebarItem) => user.role?.permissions.includes(item.permission));
  //   console.log(content)
  //   setSideBarContent(content);
  // }, [user]);

  /**
   * Refetch user data
   */
  const refetch = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  // Fetch user on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    isLoading,
    isError,
    error,
    sideBarContent,
    refetch,
    updateProfile,
    logout,
  };
}
