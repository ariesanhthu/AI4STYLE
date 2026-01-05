import { apiClient } from "@/lib/open-api-client"
import { GetListOrderDto } from "../types"
import { MOCK_ORDERS } from "./mock-data";

export const orderService = {
  getList: async (query: GetListOrderDto) => {
    const response = await apiClient.GET("/shop/v1/admin/payments", {
      params: {
        query: {
          limit: query?.limit,
          cursor: query?.cursor,
          sortOrder: query?.sortOrder,
          status: query?.status,
          type: query?.type,
          startDate: query?.startDate,
          endDate: query?.endDate,
        }
      }
    });

    if (response.error) {
      throw new Error(response.error.message || "Failed to fetch orders");
    }

    return response.data?.data || { items: [], nextCursor: null };
  },

  getById: async (id: string) => {
    // START: MOCK DATA (Pending backend implementation for get payment detail)
    await new Promise(resolve => setTimeout(resolve, 500));
    // @ts-ignore
    return MOCK_ORDERS.find(o => o.id === id);
    // END: MOCK DATA
  },

  async cancel(id: string) {
    return apiClient.POST('/shop/v1/admin/payments/{id}/cancel', {
      params: {
        path: { id }
      }
    });
  },

  async refund(id: string) {
    return apiClient.POST('/shop/v1/admin/payments/{id}/refund', {
      params: {
        path: { id }
      }
    });
  }
}
