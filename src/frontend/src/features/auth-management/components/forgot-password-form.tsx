"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { authService } from "../services/auth.service";

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
      // await authService.forgotPassword({ email });
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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
      </Button>

      <div className="text-center text-sm text-muted-foreground space-y-2">
        <div>
          <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
            Quay lại đăng nhập
          </Link>
        </div>
        <div>
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-primary hover:text-primary/80 font-medium">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </form>
  );
}
