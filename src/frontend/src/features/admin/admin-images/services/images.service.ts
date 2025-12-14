import { apiClient } from "@/lib/open-api-client/open-api-client";
import {
  UploadImageRequest,
  UploadImageResponse,
  BulkUploadImageRequest,
  BulkUploadImageResponse,
  BulkDeleteImageRequest,
  BulkDeleteImageResponse,
  DeleteImageRequest,
  DeleteImageResponse,
  GetListImageRequest,
  GetListImageResponse,
} from "../types/images.type";

export const imageService = {
  uploadImage: async (body: UploadImageRequest): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append("title", body.title);
    if (body.file) {
      formData.append("file", body.file as unknown as Blob);
    }

    const { data, error } = await apiClient.POST("/shop/v1/admin/upload/images", {
      body: formData as any, // Type cast because openapi-fetch automatic inference might be tricky with our custom script update
    });

    if (error) throw error;
    // if (!data.success) throw new Error(data.message );
    return data.data;
  },

  bulkUploadImages: async (body: { titles?: string; files: File[] }): Promise<BulkUploadImageResponse> => {
    const formData = new FormData();
    if (body.titles) {
      formData.append("titles", body.titles);
    }
    body.files.forEach((file) => {
      formData.append("files", file);
    });

    const { data, error } = await apiClient.POST("/shop/v1/admin/upload/images/bulk", {
      body: formData as any,
    });

    if (error) throw error;
    // if (!data.success) throw new Error(data.message);
    return data.data;
  },

  getListImages: async (params: GetListImageRequest): Promise<GetListImageResponse> => {
    const { data, error } = await apiClient.GET("/shop/v1/admin/upload/images", {
      params: {
        query: params,
      },
    });

    if (error) throw error;
    // if (!data.success) throw new Error(data.message);
    return data.data;
  },

  getImageById: async (id: string) => {
    const { data, error } = await apiClient.GET("/shop/v1/admin/upload/images/{id}", {
      params: {
        path: { id }
      }
    });
    if (error) throw error;
    // if (!data.success) throw new Error(data.message);
    return data.data;
  },

  deleteImage: async (id: string): Promise<DeleteImageResponse> => {
    const { data, error } = await apiClient.DELETE("/shop/v1/admin/upload/images/{id}", {
      params: {
        path: { id },
      },
    });

    if (error) throw error;
    // if (!data.success) throw new Error(data.message);
    return data.data;
  },

  bulkDeleteImages: async (body: BulkDeleteImageRequest): Promise<BulkDeleteImageResponse> => {
    const { data, error } = await apiClient.DELETE("/shop/v1/admin/upload/images", {
      body,
    });

    if (error) throw error;
    // if (!data.success) throw new Error(data.message);
    return data.data;
  },
};
