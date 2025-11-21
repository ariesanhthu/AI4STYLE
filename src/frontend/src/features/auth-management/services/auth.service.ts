import { apiClient } from "@/lib/api-client";
import type { ForgotPasswordData, ResetPasswordData } from "../types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export const authService = {
  /**
   * Request password reset
   */
  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`${BASE_URL}/auth/forgot-password`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`${BASE_URL}/auth/reset-password`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<any> {
    // replace khi có API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: { id: "1", email, name: "User Name" },
          token: "mock-jwt-token",
        });
      }, 1000);
    });
  },

  /**
   * Register new user
   */
  async register(email: string, password: string, name: string): Promise<any> {
    // replace khi có API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: { id: "1", email, name },
          token: "mock-jwt-token",
        });
      }, 1000);
    });
  },
};
