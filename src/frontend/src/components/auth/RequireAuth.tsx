"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/features/auth-management";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader";
import { tokenManager } from "@/lib/open-api-client";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  console.log("[RequireAuth] State:", { 
    isLoading, 
    isAuthenticated, 
    hasUser: !!user,
    hasToken: !!tokenManager.getAccessToken()
  });

  useEffect(() => {
    // ✅ FIX: Only redirect when loading is complete AND not authenticated
    if (!isLoading && !isAuthenticated) {
      console.log("[RequireAuth] Not authenticated, redirecting to login");
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // ✅ Show loader while checking authentication
  if (isLoading) {
    console.log("[RequireAuth] Still loading auth state...");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // ✅ Show loader while redirecting
  if (!isAuthenticated) {
    console.log("[RequireAuth] Not authenticated, showing loader before redirect");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  console.log("[RequireAuth] ✅ Authenticated, rendering protected content");
  return <>{children}</>;
}
