import { apiClient } from "@/lib/open-api-client"
import { GetListOrderDto } from "../types"
import { MOCK_ORDERS } from "./mock-data";

export const orderService = {
  getList: async (query: GetListOrderDto) => {
    // MOCK DATA IMPLEMENTATION
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simple pagination mock
    const items = MOCK_ORDERS;
    return { items, nextCursor: null, total: items.length };

    /*
    const response = await apiClient.GET("/shop/v1/admin/order", {
      params: {
        query
      }
    })

    if (response.error) {
      throw new Error(response.error.message || "Failed to fetch orders");
    }

    return response.data?.data || { items: [], nextCursor: null, total: 0 };
    */
  },

  delete: async (id: string) => {
    // MOCK DATA IMPLEMENTATION
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };

    /*
    const response = await apiClient.DELETE("/shop/v1/admin/order/{id}", {
      params: { path: { id } }
    })

    if (response.error) {
      throw new Error(response.error.message || "Failed to delete order");
    }

    return response.data;
    */
  },

  getById: async (id: string) => {
    // MOCK DATA IMPLEMENTATION
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_ORDERS.find(o => o.id === id);

    /*
    const response = await apiClient.GET("/shop/v1/admin/order/{id}", {
      params: { path: { id } }
    });

    if (response.error) {
      throw new Error(response.error.message || "Failed to get order detail");
    }
    return response.data?.data;
    */
  }
}
