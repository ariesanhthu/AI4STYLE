import { apiClient } from "@/lib/open-api-client"
import { GetListProductDto, CreateProductDto, UpdateProductDto, GetProductByIdQueryDto } from "../types"

export const productService = {
  getList: async (query: GetListProductDto) => {
    const response = await apiClient.GET("/shop/v1/admin/product", {
      params: {
        query
      }
    })

    if (response.error) {
      throw new Error(response.error.message || "Failed to fetch products");
    }

    // Assuming backend returns { data: { items: [], nextCursor: ... } } structure similar to users
    // If not, we might need to adjust based on actual API response. 
    // For now, mapping directly to response.data
    return response.data?.data || { items: [], nextCursor: null, total: 0 };
  },

  create: async (body: CreateProductDto) => {
    const response = await apiClient.POST("/shop/v1/admin/product", {
      body
    })

    if (response.error) {
      throw new Error(response.error.message || "Failed to create product");
    }

    return response.data;
  },

  update: async (id: string, body: UpdateProductDto) => {
    const response = await apiClient.PATCH("/shop/v1/admin/product/{id}", {
      params: { path: { id } },
      body
    })

    if (response.error) {
      throw new Error(response.error.message || "Failed to update product");
    }

    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.DELETE("/shop/v1/admin/product/{id}", {
      params: { path: { id } }
    })

    if (response.error) {
      throw new Error(response.error.message || "Failed to delete product");
    }

    return response.data;
  },

  getById: async (id: string, query?: GetProductByIdQueryDto) => {
    const response = await apiClient.GET("/shop/v1/admin/product/{id}", {
      params: { path: { id }, query }
    });

    if (response.error) {
      throw new Error(response.error.message || "Failed to get product detail");
    }
    return response.data?.data; // Assuming data wrapper
  }
}
