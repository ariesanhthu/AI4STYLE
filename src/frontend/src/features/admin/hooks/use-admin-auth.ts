"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth-management";
import type { UserProfileResponse } from "../admin-sidebar/types/user.type";
import { SIDEBAR_ITEMS, SidebarItem } from "../admin-sidebar/types/sidebar.type";

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
 * Uses the central useAuth hook and adds admin-specific logic (sidebar)
 */
export function useAdminAuth(): UseAdminAuthReturn {
  const { user, isLoading, isError, error, refreshUser, updateUser, signOut } = useAuth();
  const [sideBarContent, setSideBarContent] = useState<SidebarItem[] | null>(null);

  useEffect(() => {
    if (!user) {
      setSideBarContent(null);
      return;
    }

    // Filter sidebar items based on permissions
    // Note: user.role is expected to persist on the user object
    const content = SIDEBAR_ITEMS.filter((item: SidebarItem) =>
      user.role?.permissions.includes(item.permission)
    );
    setSideBarContent(content);
  }, [user]);

  return {
    user: user as UserProfileResponse | null,
    isLoading,
    isError,
    error,
    sideBarContent,
    refetch: refreshUser,
    updateProfile: updateUser as any, // Cast to match interface if needed
    logout: signOut,
  };
}
