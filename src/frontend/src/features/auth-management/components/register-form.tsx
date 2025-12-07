"use client";

import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function RegisterForm() {
  const { signUp, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const errors: typeof fieldErrors = {};

    if (!name) {
      errors.name = "Tên không được để trống";
    } else if (name.length < 2) {
      errors.name = "Tên phải có ít nhất 2 ký tự";
    }

    if (!email) {
      errors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!phone) {
      errors.phone = "Số điện thoại không được để trống";
    } else if (!/^(0|\+84)[0-9]{9}$/.test(phone.replace(/\s/g, ""))) {
      errors.phone = "Số điện thoại không hợp lệ (VD: 0912345678)";
    }

    if (!password) {
      errors.password = "Mật khẩu không được để trống";
    } else if (password.length < 8) {
      errors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await signUp(email, password, name, phone);
      // Will auto-login and redirect to home
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Đăng ký thất bại";
      
      // Xử lý lỗi cụ thể từ backend
      if (errorMessage.includes("phone") || errorMessage.includes("Unique constraint")) {
        setFieldErrors({ phone: "Số điện thoại này đã được đăng ký" });
        setError("Số điện thoại đã tồn tại. Vui lòng sử dụng số điện thoại khác.");
      } else if (errorMessage.includes("email")) {
        setFieldErrors({ email: "Email này đã được đăng ký" });
        setError("Email đã tồn tại. Vui lòng sử dụng email khác.");
      } else {
        setError(errorMessage);
      }
    }
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return null;
    if (pwd.length < 8) return { label: "Yếu", color: "text-red-600" };
    if (pwd.length < 12) return { label: "Trung bình", color: "text-yellow-600" };
    return { label: "Mạnh", color: "text-green-600" };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Họ và tên <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Nguyễn Văn A"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setFieldErrors((prev) => ({ ...prev, name: undefined }));
          }}
          disabled={isLoading}
          className={fieldErrors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {fieldErrors.name && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setFieldErrors((prev) => ({ ...prev, email: undefined }));
          }}
          disabled={isLoading}
          className={fieldErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {fieldErrors.email && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium">
          Số điện thoại <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="0912345678"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setFieldErrors((prev) => ({ ...prev, phone: undefined }));
          }}
          disabled={isLoading}
          className={fieldErrors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {fieldErrors.phone && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {fieldErrors.phone}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Mật khẩu <span className="text-red-500">*</span>
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setFieldErrors((prev) => ({ ...prev, password: undefined }));
          }}
          disabled={isLoading}
          className={fieldErrors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {passwordStrength && (
          <p className={`text-xs ${passwordStrength.color} flex items-center gap-1`}>
            {passwordStrength.label === "Mạnh" && <CheckCircle2 className="h-3 w-3" />}
            Độ mạnh: {passwordStrength.label}
          </p>
        )}
        {fieldErrors.password && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {fieldErrors.password}
          </p>
        )}
        {!fieldErrors.password && !passwordStrength && (
          <p className="text-xs text-gray-500">Tối thiểu 8 ký tự</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium">
          Xác nhận mật khẩu <span className="text-red-500">*</span>
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          }}
          disabled={isLoading}
          className={fieldErrors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {confirmPassword && password === confirmPassword && !fieldErrors.confirmPassword && (
          <p className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Mật khẩu khớp
          </p>
        )}
        {fieldErrors.confirmPassword && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {fieldErrors.confirmPassword}
          </p>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
        {isLoading ? "Đăng ký..." : "Đăng ký"}
      </Button>
    </form>
  );
}
