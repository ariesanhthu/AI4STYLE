"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { AuthLayout } from "./auth-layout";
import { ResetPasswordForm } from "./reset-password-form";

interface ResetPasswordPageProps {
  token: string | null;
}

export function ResetPasswordPage({ token }: ResetPasswordPageProps) {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  };

  if (success) {
    return (
      <AuthLayout
        title="Mật khẩu đã được đặt lại ✓"
        description="Bạn có thể đăng nhập với mật khẩu mới"
      >
        <div className="space-y-4">
          <Alert className="border-green-500 bg-green-50 text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Mật khẩu của bạn đã được cập nhật thành công. Đang chuyển đến trang đăng nhập...
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full">
            <Link href="/login">
              Đăng nhập ngay
            </Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Đặt lại mật khẩu"
      description="Nhập mật khẩu mới cho tài khoản của bạn"
    >
      <ResetPasswordForm token={token} onSuccess={handleSuccess} />
    </AuthLayout>
  );
}
