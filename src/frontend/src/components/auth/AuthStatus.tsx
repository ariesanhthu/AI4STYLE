"use client";

import { useAuth } from "@/features/auth-management";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export function AuthStatus() {
  const { user, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering user-specific content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial render, show login buttons
  if (!mounted || !user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="outline">Đăng nhập</Button>
        </Link>
        <Link href="/register">
          <Button>Đăng ký</Button>
        </Link>
      </div>
    );
  }

  // After mount, if user exists, show authenticated state
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">
        Xin chào, <span className="font-semibold">{user.name || user.email}</span>
      </span>
      <Link href="/profile">
        <Button variant="outline" size="sm">
          Hồ sơ
        </Button>
      </Link>
      <Button variant="outline" size="sm" onClick={signOut}>
        Đăng xuất
      </Button>
    </div>
  );
}
