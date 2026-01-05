import { apiClient } from "@/lib/open-api-client";
import { CreateProductDto, GetListProductDto, UpdateProductDto } from "../types";
import { ProductListResponse } from "../types/product.type";


const productService = {
  async createProduct(data: CreateProductDto) {
    const response = await apiClient.POST("/shop/v1/admin/product", {
      body: data,
    });
    if (response.error) {
      throw new Error(response.error.message || "Failed to create product");
    }
    return response.data;
  },

  async getProducts(query: GetListProductDto) {
    const response = await apiClient.GET("/shop/v1/admin/product", {
      params: {
        query,
      },
    });
    if (response.error) {
      throw new Error(response.error.message || "Failed to fetch products");
    }
    return response.data;
  },

  async getProductById(id: string) {
    const response = await apiClient.GET("/shop/v1/admin/product/{id}", {
      params: {
        path: { id },
        query: {
          includeOptions: "true",
          includeVariants: "true",
        },
      },
    });
    if (response.error) {
      throw new Error(response.error.message || "Failed to fetch product details");
    }
    return response.data;
  },

  async deleteProduct(id: string) {
    const response = await apiClient.DELETE("/shop/v1/admin/product/{id}", {
      params: {
        path: { id },
      },
    });
    if (response.error) {
      throw new Error(response.error.message || "Failed to delete product");
    }
    return response.data;
  },

  async updateProduct(id: string, data: UpdateProductDto) {
    console.log("Updating product:", id, data);
    const response = await apiClient.PATCH("/shop/v1/admin/product/{id}", {
      params: {
        path: { id },
      },
      body: data,
    });
    if (response.error) {
      throw new Error(response.error.message || "Failed to update product");
    }
    return response.data;
  },
};

export default productService;
