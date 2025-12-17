"use client";

import React from "react";
import { SidebarFooter } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, RefreshCw } from "lucide-react";
import { useAdminAuth } from "../../hooks/use-admin-auth";
import { ThemeToggle } from "@/components/providers/theme-toggle/theme-toggle"

export function AdminSidebarFooter() {
  const { user, isLoading, isError, error, logout, refetch } = useAdminAuth();

  // Loading state
  if (isLoading) {
    return (
      <SidebarFooter>
        <div className="flex items-center gap-3 p-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </SidebarFooter>
    );
  }

  // Error state
  if (isError || !user) {
    return (
      <SidebarFooter>
        <div className="p-2">
          <div className="text-sm text-destructive mb-2">
            {error?.message || "Failed to load user data"}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </SidebarFooter>
    );
  }

  // Success state with user data
  return (
    <SidebarFooter>
        <div className="flex flex-row items-center gap-3 m-3">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>

        <ThemeToggle />
        {/* <Button variant="ghost" size="sm" onClick={logout} className="">
          <LogOut className="h-4 w-4" />
        </Button> */}
        </div>
    </SidebarFooter>
  );
}