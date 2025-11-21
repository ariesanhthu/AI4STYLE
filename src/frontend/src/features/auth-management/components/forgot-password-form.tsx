"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { authService } from "../services/auth.service";
import type { ForgotPasswordData } from "../types/auth";

interface ForgotPasswordFormProps {
  onSuccess?: (email: string) => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword({ email });
      setLoading(false);
      onSuccess?.(email);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm border border-red-200">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
      </Button>

      <div className="text-center text-sm text-gray-600 space-y-2">
        <div>
          <Link href="/login" className="text-brand-to hover:text-brand-hover font-medium">
            Quay lại đăng nhập
          </Link>
        </div>
        <div>
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-brand-to hover:text-brand-hover font-medium">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </form>
  );
}
