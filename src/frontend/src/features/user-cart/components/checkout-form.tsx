"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CartItem } from "@/context/cart-context";

interface CheckoutFormProps {
  cartItems: CartItem[];
  onCancel: () => void;
  onSubmit: () => void;
}

export function CheckoutForm({
  cartItems,
  onCancel,
  onSubmit,
}: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    recipientName: "",
    phoneNumber: "",
    shippingAddress: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderDetails = cartItems.map((item) => ({
      variantId:
        item.selectedVariantId || item.product.variants[0]?.variantId || "",
      quantity: item.quantity,
    }));

    const payload = {
      ...formData,
      orderDetails,
    };

    console.log("PAYLOAD_SUBMIT:", JSON.stringify(payload, null, 2));

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onSubmit();
      // In a real app, you might redirect to a success page here or call an API
      alert("Order submitted successfully! Check console for payload.");
    }, 1000);
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
          <Label htmlFor="recipientName">Tên người nhận</Label>
          <Input
            id="recipientName"
            name="recipientName"
            required
            value={formData.recipientName}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Số điện thoại</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            required
            type="tel"
            value={formData.phoneNumber}
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
          <Label htmlFor="shippingAddress">Địa chỉ giao hàng</Label>
          <Textarea
            id="shippingAddress"
            name="shippingAddress"
            required
            value={formData.shippingAddress}
            onChange={handleChange}
            placeholder="Số nhà, tên đường, phường/xã..."
            className="min-h-[100px]"
          />
        </div>

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
            className="flex-1 bg-brand-primary hover:bg-brand-secondary"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
          </Button>
        </div>
      </form>
    </div>
  );
}
