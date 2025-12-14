import { apiClient } from "@/lib/open-api-client";
import { Order, OrderGetMyOrdersParams, OrderGetMyOrdersResponse } from "../types/order.type";

export const orderService = {
  getMyOrders: async (
    params?: OrderGetMyOrdersParams
  ): Promise<OrderGetMyOrdersResponse> => {
    const { data, error } = await apiClient.GET("/shop/v1/client/orders/my-orders", {
      params: {
        query: params,
      },
    });

    if (error) {
      console.error("Error fetching orders:", error);
      throw new Error("Failed to fetch orders");
    }

    return data?.data;
  },

  getOrderByCode: async (code: string): Promise<Order | null> => {
    const { data, error } = await apiClient.GET(
      "/shop/v1/client/orders/code/{code}",
      {
        params: {
          path: {
            code: code,
          },
        },
      }
    );

    if (error) {
      console.error("Error fetching order details:", error);
      return null;
    }

    return data?.data;
  },

  refundRequest: async (orderId: string): Promise<void> => {
    // Placeholder for refund request logic
    console.log("Refund requested for order:", orderId);
    return Promise.resolve();
  },
};
