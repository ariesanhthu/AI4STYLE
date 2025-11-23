import { apiClient } from "@/lib/api-client";
import type { UserProfile, UpdateProfileData } from "../types/profile";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export const profileService = {
  /**
   * Get user profile
   */
  async getProfile(): Promise<UserProfile> {
    // replace khi có API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: "1",
          email: "user@example.com",
          name: "User Name",
          phone: "",
          address: "",
        });
      }, 500);
    });
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    // replace khi có API call
    return apiClient<UserProfile>(`${BASE_URL}/profile`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    // replace khi có API call
    return apiClient<{ message: string }>(`${BASE_URL}/profile/password`, {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};
