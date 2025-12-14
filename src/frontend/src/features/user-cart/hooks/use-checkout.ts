import { useState, useEffect } from "react";
import { cartService, PaymentMethod } from "../services/cart.service";
import { CartItem } from "../context/cart-context";
import type { order, payment } from "../types";

interface CheckoutResponse {
  orderResponse: order.CreateOrderResponse;
  paymentResponse: payment.CreatePaymentResponse;
}

export function useCheckout() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const methods = await cartService.getPaymentMethods();
      setPaymentMethods(methods);
    };
    fetchPaymentMethods();
  }, []);

  const placeOrder = async (
    recipientName: string,
    phoneNumber: string,
    shippingAddress: string,
    email: string,
    cartItems: CartItem[],
    paymentMethodId: string,
    onSuccess: () => void
  ) => {
    setLoading(true);
    setMessage(null);

    try {
      const response: CheckoutResponse = await cartService.submitOrder(
        recipientName,
        phoneNumber,
        shippingAddress,
        email,
        paymentMethodId,
        cartItems
      );

      setMessage({
        type: "success",
        text: "Đặt hàng thành công! Đang chuyển hướng...",
      });

      const payUrl = response.paymentResponse.data?.payUrl;

      if (payUrl) {
        window.open(payUrl, "_blank");
        onSuccess();
        return;
      }

      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error) {
      console.error("Checkout error:", error);
      setMessage({
        type: "error",
        text: `Đặt hàng thất bại. ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    paymentMethods,
    loading,
    message,
    placeOrder,
  };
}
