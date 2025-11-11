"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { apiPost } from "@/lib/api-client";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-green-600">
              ✓ Email đã được gửi
            </CardTitle>
            <CardDescription className="text-center">
              Kiểm tra hộp thư của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-md text-sm">
              Chúng tôi đã gửi link đặt lại mật khẩu đến email <strong>{email}</strong>.
              Vui lòng kiểm tra hộp thư (và cả thư mục spam).
            </div>

            <div className="text-center text-sm text-gray-600">
              Không nhận được email?{" "}
              <button
                onClick={() => setSuccess(false)}
                className="text-blue-600 hover:underline"
              >
                Gửi lại
              </button>
            </div>

            <Link href="/login" className="block">
              <Button variant="outline" className="w-full">
                Quay lại đăng nhập
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Quên mật khẩu
          </CardTitle>
          <CardDescription className="text-center">
            Nhập email của bạn để nhận link đặt lại mật khẩu
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
            </Button>

            <div className="text-center text-sm text-gray-600 space-y-2">
              <div>
                <Link href="/login" className="text-blue-600 hover:underline">
                  Quay lại đăng nhập
                </Link>
              </div>
              <div>
                Chưa có tài khoản?{" "}
                <Link href="/register" className="text-blue-600 hover:underline">
                  Đăng ký ngay
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
