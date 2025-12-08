"use client";

import { useAuth } from "../hooks/use-auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AuthStatus() {
  const { user, isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated || !user) {
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
