"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthLayout } from "@/components/auth/AuthLayout";
import Link from "next/link";

export default function AuthPage() {
  const { login, register, loading } = useAuth();
  const router = useRouter();

  // Sign In state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sign Up state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail || !loginPassword) {
      setLoginError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const res = await login(loginEmail, loginPassword);

    if (!res.ok) {
      setLoginError(res.error || "Đăng nhập thất bại");
      return;
    }

    router.push("/profile");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (!signupName || !signupEmail || !signupPassword) {
      setSignupError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Mật khẩu xác nhận không khớp");
      return;
    }

    const res = await register(signupEmail, signupPassword, signupName);

    if (!res.ok) {
      setSignupError(res.error || "Đăng ký thất bại");
      return;
    }

    router.push("/profile");
  };

  return (
    <AuthLayout>
      <Tabs defaultValue="signin" className="w-full">
        {/* Tabs Header - Sign In and Sign Up buttons */}
        <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
          <TabsTrigger value="signin" className="text-base font-semibold">
            Sign In
          </TabsTrigger>
          <TabsTrigger value="signup" className="text-base font-semibold">
            Sign Up
          </TabsTrigger>
        </TabsList>

        {/* Sign In Form */}
        <TabsContent value="signin">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="login-email"
                type="email"
                placeholder="name@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-brand-to hover:text-brand-hover font-medium">
                Forgot password?
              </Link>
            </div>

            {loginError && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-200">
                {loginError}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-brand-from to-brand-to hover:opacity-90 text-base font-semibold" 
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Sign In"}
            </Button>
          </form>
        </TabsContent>

        {/* Sign Up Form */}
        <TabsContent value="signup">
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="signup-name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="signup-name"
                type="text"
                placeholder="Nguyễn Văn A"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                required
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="name@example.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password" className="text-sm font-medium">
                Confirm Password
              </Label>
              <Input
                id="signup-confirm-password"
                type="password"
                placeholder="••••••••"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="h-11"
              />
            </div>

            {signupError && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-200">
                {signupError}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-brand-from to-brand-to hover:opacity-90 text-base font-semibold" 
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Sign Up"}
            </Button>

            <p className="text-xs text-center text-gray-600">
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <Link href="/terms" className="text-brand-to hover:text-brand-hover font-medium">
                Điều khoản
              </Link>{" "}
              và{" "}
              <Link href="/privacy" className="text-brand-to hover:text-brand-hover font-medium">
                Chính sách bảo mật
              </Link>
            </p>
          </form>
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
}
