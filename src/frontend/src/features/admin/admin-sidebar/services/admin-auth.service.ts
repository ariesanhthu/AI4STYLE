// import { apiClient } from "@/lib/api-client";
import { apiClient } from "@/lib/open-api-client";
import type { UserProfileResponse } from "../types/user.type";

// Mock data for development
const MOCK_USER: UserProfileResponse = {
  id: "admin-001",
  email: "admin@ai4style.com",
  name: "John Doe",
  gender: "MALE",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  roleId: "123424", // UUID of the role
  phone: "",
  birthdate: "1970-01-01", // iso date string
  address: "Somewhere",
  createdAt: "2023-01-01T00:00:00.000Z",
  updatedAt: "2023-01-01T00:00:00.000Z",
};

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const adminAuthService = {
  /**
   * Get current authenticated admin user
   * TODO: Replace with actual API call when backend is ready
   */
  async getCurrentUser(): Promise<UserProfileResponse> {
    
    const data = await apiClient.GET("/shop/v1/admin/users/profile");
    if (data.error) {
      throw new Error(data.error.message || "Failed to fetch user profile");
    }
    
    try {
      console.log('Fetched User Data:', data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

    return data.data.data;
  },

  async updateProfile(data: Partial<UserProfileResponse>): Promise<UserProfileResponse> {
    // Mock API call
    await delay(400);
    
    // Update the MOCK_USER for simulation purposes
    Object.assign(MOCK_USER, data);
    
    return MOCK_USER;
    
    // Real API call (commented for future use):
    // return apiClient<User>(`${BASE_URL}/api/admin/profile`, {
    //   method: "PUT",
    //   credentials: "include",
    //   body: JSON.stringify(data),
    // });
  },

  /**
   * Logout admin user
   * TODO: Replace with actual API call when backend is ready
   */
  async logout(): Promise<void> {
    // Mock API call
    await delay(300);
    
    // Clear any local storage/session storage if needed
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
    }
    
    // Real API call (commented for future use):
    // return apiClient<void>(`${BASE_URL}/api/admin/logout`, {
    //   method: "POST",
    //   credentials: "include",
    // });
  },

  /**
   * Refresh admin token
   * TODO: Replace with actual API call when backend is ready
   */
  async refreshToken(): Promise<{ token: string }> {
    // Mock API call
    await delay(400);
    
    return {
      token: "mock_token_" + Date.now(),
    };
    
    // Real API call (commented for future use):
    // return apiClient<{ token: string }>(`${BASE_URL}/api/admin/refresh`, {
    //   method: "POST",
    //   credentials: "include",
    // });
  },
};
