"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth-management/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CartItem } from "@/features/user-cart/context/cart-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useCheckout } from "../hooks/use-checkout";

interface CheckoutFormProps {
  cartItems: CartItem[];
  onCancel: () => void;
  onSubmit: () => void;
}

interface ExtendedUser {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export function CheckoutForm({
  cartItems,
  onCancel,
  onSubmit,
}: CheckoutFormProps) {
  const { user } = useAuth();
  const { paymentMethods, loading, message, placeOrder } = useCheckout();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");

  useEffect(() => {
    if (paymentMethods.length > 0 && !selectedPaymentMethod) {
      setSelectedPaymentMethod(paymentMethods[0].paymentMethodId);
    }
  }, [paymentMethods, selectedPaymentMethod]);

  useEffect(() => {
    if (user) {
      const typedUser = user as ExtendedUser;
      setFormData((prev) => ({
        ...prev,
        name: typedUser.name || prev.name,
        phone: typedUser.phone || prev.phone,
        email: typedUser.email || prev.email,
        address: typedUser.address || prev.address,
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await placeOrder(
      formData.name,
      formData.phone,
      formData.address,
      formData.email,
      cartItems,
      selectedPaymentMethod,
      onSubmit
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-gray-900">
        Thông tin giao hàng
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tên người nhận</Label>
          <Input
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            name="phone"
            required
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0123456789"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            required
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Địa chỉ giao hàng</Label>
          <Textarea
            id="address"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            placeholder="Số nhà, tên đường, phường/xã..."
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-3 pt-2">
          <Label>Phương thức thanh toán</Label>
          <div className="grid gap-3">
            {paymentMethods.map((method) => (
              <div
                key={method.paymentMethodId}
                className={`relative flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all hover:border-primary ${
                  selectedPaymentMethod === method.paymentMethodId
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedPaymentMethod(method.paymentMethodId)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl">
                  {method.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {method.displayName}
                  </p>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
                {selectedPaymentMethod === method.paymentMethodId && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {message && (
          <Alert
            variant={message.type === "error" ? "destructive" : "default"}
            className={
              message.type === "success"
                ? "border-green-500 bg-green-50 text-green-700"
                : ""
            }
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={loading}
          >
            Quay lại giỏ hàng
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-primary text-primary-foreground hover:bg-brand-secondary"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
          </Button>
        </div>
      </form>
    </div>
  );
}
