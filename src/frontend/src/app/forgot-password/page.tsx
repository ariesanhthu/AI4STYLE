"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { apiPost } from "@/lib/api-client";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }

    setLoading(true);
    const { data, error: apiError } = await apiPost<{ message: string }>(
      "/auth/forgot-password",
      { email }
    );
    setLoading(false);

    if (apiError || !data) {
      setError(apiError || "Có lỗi xảy ra. Vui lòng thử lại.");
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <AuthLayout
        title="Email đã được gửi ✓"
        description="Kiểm tra hộp thư của bạn"
      >
        <div className="space-y-4">
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-md text-sm border border-green-200">
            Chúng tôi đã gửi link đặt lại mật khẩu đến email <strong>{email}</strong>.
            Vui lòng kiểm tra hộp thư (và cả thư mục spam).
          </div>

          <div className="text-center text-sm text-gray-600">
            Không nhận được email?{" "}
            <button
              onClick={() => setSuccess(false)}
              className="text-brand-to hover:text-brand-hover font-medium"
            >
              Gửi lại
            </button>
          </div>

          <Link href="/login" className="block">
            <Button variant="outline" className="w-full">
              Quay lại đăng nhập
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Quên mật khẩu"
      description="Nhập email của bạn để nhận link đặt lại mật khẩu"
    >
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
    </AuthLayout>
  );
}
