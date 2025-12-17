import { apiClient } from "@/lib/open-api-client";
import { CartItem } from "../context/cart-context";
import type { payment, order } from "../types/index";

export interface PaymentMethod {
  paymentMethodId: string;
  displayName: string;
  type: "CASH_ON_DELIVERY" | "MOMO";
  icon: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OrderDetails {
  variantId: string;
  quantity: number;
}

export const cartService = {
  getPaymentMethods: async () => {
    const { data, error } = await apiClient.GET(
      "/shop/v1/client/payment-methods"
    );

    if (error) {
      console.error("Failed to fetch payment methods:", error);
      return [];
    }

    return (data as payment.PaymentMethodResponse).data as PaymentMethod[];
  },

  submitOrder: async (
    recipientName: string,
    phoneNumber: string,
    shippingAddress: string,
    email: string,
    paymentMethodId: string,
    cartItems: CartItem[]
  ) => {
    const orderDetails: OrderDetails[] = cartItems.map((item) => ({
      variantId:
        item.selectedVariantId || item.product.variants[0]?.variantId || "",
      quantity: item.quantity,
    }));

    const payload: order.CreateOrderRequest = {
      recipientName,
      phoneNumber,
      shippingAddress,
      email: email || undefined,
      orderDetails,
    };

    const { data: orderResponse, error } = await apiClient.POST(
      "/shop/v1/client/orders",
      {
        body: payload,
      }
    );

    if (!orderResponse) {
      console.error("Failed to create order:", error);
      throw new Error(
        (error as { message?: string })?.message || "Tạo đơn hàng thất bại"
      );
    }

    const paymentPayload: payment.CreatePaymentRequest = {
      orderId: orderResponse.data.orderId,
      paymentMethodId,
    };

    const { data: paymentResponse, error: paymentError } = await apiClient.POST(
      "/shop/v1/client/payments",
      {
        body: paymentPayload,
      }
    );

    if (!paymentResponse) {
      console.error("Failed to create payment:", paymentError);
      throw new Error(
        (paymentError as { message?: string })?.message ||
          "Tạo thanh toán thất bại"
      );
    }

    return { orderResponse, paymentResponse };
  },

  createPayment: async (orderId: string, paymentMethodId: string) => {
    const { data, error } = await apiClient.POST(`/shop/v1/client/payments`, {
      body: {
        orderId,
        paymentMethodId,
      },
    });

    if (error) {
      console.error("Failed to create payment:", error);
      throw new Error(
        (error as { message?: string })?.message || "Tạo thanh toán thất bại"
      );
    }

    return (data as payment.CreatePaymentResponse).data;
  },
};
