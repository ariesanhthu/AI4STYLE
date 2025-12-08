"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { authService } from "../services/auth.service";

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
      // await authService.resetPassword({ token, password });
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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
          </AlertDescription>
        </Alert>
        <Button asChild className="w-full">
          <Link href="/forgot-password">
            Yêu cầu link mới
          </Link>
        </Button>
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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
          Quay lại đăng nhập
        </Link>
      </div>
    </form>
  );
}
