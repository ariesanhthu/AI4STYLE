import { apiClient } from "@/lib/open-api-client";
import {
  RoleGetAllRequest,
  RoleGetAllResponse,
  RoleGetByIdResponse,
  RoleCreateRequest,
  RoleCreateResponse,
  RoleUpdateRequest,
  RoleUpdateResponse,
  RoleDeleteResponse
} from "../types/role.type";

export const roleService = {
  getRoles: async (params?: RoleGetAllRequest): Promise<RoleGetAllResponse> => {
    const response = await apiClient.GET("/shop/v1/admin/roles", {
      params: {
        query: params,
      },
    });
    if (response.error) {
      throw response.error;
    }
    return response.data.data;
  },

  getRoleById: async (id: string): Promise<RoleGetByIdResponse> => {
    const response = await apiClient.GET("/shop/v1/admin/roles/{id}", {
      params: {
        path: { id },
      },
    });
    if (response.error) {
      throw response.error;
    }
    return response.data.data;
  },

  createRole: async (body: RoleCreateRequest): Promise<RoleCreateResponse> => {
    const response = await apiClient.POST("/shop/v1/admin/roles/staff", {
      body,
    });
    if (response.error) {
      throw response.error;
    }
    return response.data.data;
  },

  updateRole: async (id: string, body: RoleUpdateRequest): Promise<RoleUpdateResponse> => {
    const response = await apiClient.PATCH("/shop/v1/admin/roles/{id}", {
      params: {
        path: { id },
      },
      body,
    });
    if (response.error) {
      throw response.error;
    }
    return response.data.data;
  },

  deleteRole: async (id: string): Promise<RoleDeleteResponse> => {
    const response = await apiClient.DELETE("/shop/v1/admin/roles/{id}", {
      params: {
        path: { id },
      },
    });
    if (response.error) {
      throw response.error;
    }
    return response.data.data;
  },
};
