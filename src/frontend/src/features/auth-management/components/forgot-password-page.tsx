"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "./auth-layout";
import { ForgotPasswordForm } from "./forgot-password-form";

export function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSuccess = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setSuccess(true);
  };

  if (success) {
    return (
      <AuthLayout
        title="Email đã được gửi"
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
      <ForgotPasswordForm onSuccess={handleSuccess} />
    </AuthLayout>
  );
}
