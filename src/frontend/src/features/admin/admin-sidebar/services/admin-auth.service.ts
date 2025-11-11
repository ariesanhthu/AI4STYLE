import { apiClient } from "@/lib/api-client";
import type { User } from "../types/user.type";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

// Mock data for development
const MOCK_USER: User = {
  id: "admin-001",
  email: "admin@ai4style.com",
  name: "John Doe",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  role: "admin",
};

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const adminAuthService = {
  /**
   * Get current authenticated admin user
   * TODO: Replace with actual API call when backend is ready
   */
  async getCurrentUser(): Promise<User> {
    // Mock API call
    await delay(500); // Simulate network delay
    
    // if (Math.random() > 0.9) {
    //   throw new Error("Failed to fetch user data");
    // }
    
    return MOCK_USER;
    
    // Real API call (commented for future use):
    // return apiClient<User>(`${BASE_URL}/api/admin/me`, {
    //   method: "GET",
    //   credentials: "include",
    // });
  },

  async updateProfile(data: Partial<User>): Promise<User> {
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
