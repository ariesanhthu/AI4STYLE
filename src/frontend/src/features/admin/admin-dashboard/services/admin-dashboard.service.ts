import { DashBoardIncomeResponse, DashBoardIncomeParamsQuery, DashBoardOrderResponse, DashBoardOrderParamsQuery } from "../types/dashboard.type"
import { apiClient } from "@/lib/open-api-client"

const topSellerData = [
  { product: "product 1", sell: 275 },
  { product: "product 2", sell: 200 },
  { product: "product 3", sell: 187 },
  { product: "product 4", sell: 173 },
  { product: "product 5", sell: 100 },
]


const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const analysService = {
  async getLineChartData(query: DashBoardIncomeParamsQuery): Promise<DashBoardIncomeResponse> {
    const response = await apiClient.GET("/shop/v1/dashboard/revenue", {
      params: {
        query: query
      }
    })

    console.log(response.data?.data)
    if (response.error) {
      throw response.error;
    }

    if (!response.data) {
      throw new Error("Failed to fetch data");
    }

    return response.data.data
  },

  // async getDataByMonth(): Promise<DashBoardIncomeData[]> {
  //   await delay(200);
  //   return chartDataByMonth
  // },

  // async getDataByYear(): Promise<DashBoardIncomeData[]> {
  //   await delay(200);
  //   return chartDataByYear
  // },

  async getTopSeller(query: DashBoardOrderParamsQuery): Promise<DashBoardOrderResponse> {
    const response = await apiClient.GET("/shop/v1/dashboard/orders", {
      params: {
        query: query
      }
    })

    console.log(response.data?.data)
    if (response.error) {
      throw response.error;
    }

    if (!response.data) {
      throw new Error("Failed to fetch data");
    }

    return response.data.data
  },

  async exportReport(query: { type: 'year' | 'month', value: number, year: number }) {
    const response = await apiClient.GET("/shop/v1/dashboard/export", {
      params: {
        query: {
          type: query.type,
          value: query.value.toString(),
          year: query.year.toString(),
        }
      },
      parseAs: "blob",
    });

    if (response.error) {
      throw response.error;
    }

    // Handle file download
    const url = window.URL.createObjectURL(response.data as Blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report-${query.type}-${query.value}-${query.year}.xlsx`); // Assuming xlsx or similar
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  }
}


