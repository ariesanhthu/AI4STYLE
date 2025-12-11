import { apiClient } from "@/lib/open-api-client";
import { ProfileResponse, UpdateProfileRequest } from "../types/profile";

export const profileService = {
  /**
   * Get user profile
   */
  async getProfile(): Promise<ProfileResponse> {
    const data = await apiClient.GET('/shop/v1/client/users/profile');
    if (data.error) {
      throw data.error
    }
    return data.data.data
  },

  /**
   * Update user profile
   */
  async updateProfile(body: UpdateProfileRequest): Promise<ProfileResponse> {
    // replace khi có API call
    const data = await apiClient.PATCH('/shop/v1/client/users/profile', {body});
    if (data.error) {
      throw data.error
    }
    return data.data.data
  },

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    // replace khi có API call
    // return apiClient<{ message: string }>(`${BASE_URL}/profile/password`, {
    //   method: "POST",
    //   body: JSON.stringify({ currentPassword, newPassword }),
    // });
    return { message: "" };
  },
};
