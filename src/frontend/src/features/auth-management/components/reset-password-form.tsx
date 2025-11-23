"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { authService } from "../services/auth.service";
import type { ResetPasswordData } from "../types/auth";

interface ResetPasswordFormProps {
  token: string | null;
  onSuccess?: () => void;
}

export function ResetPasswordForm({ token, onSuccess }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Token không hợp lệ hoặc đã hết hạn");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Token không hợp lệ");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ token, password });
      setLoading(false);
      onSuccess?.();
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra. Token có thể đã hết hạn.");
    }
  };

  if (!token) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm border border-red-200">
          Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
        </div>
        <Link href="/forgot-password" className="block">
          <Button className="w-full">Yêu cầu link mới</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu mới</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          minLength={6}
        />
        <p className="text-xs text-gray-500">Tối thiểu 6 ký tự</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
      </Button>

      <div className="text-center text-sm text-gray-600">
        <Link href="/login" className="text-brand-to hover:text-brand-hover font-medium">
          Quay lại đăng nhập
        </Link>
      </div>
    </form>
  );
}
