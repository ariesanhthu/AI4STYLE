import { apiClient } from "@/lib/open-api-client";
import { tokenManager } from "@/lib/open-api-client/token-manager";
import type { SignInDto, SignInResponse } from "../types/sign-in.types";

export const signInService = {
  /**
   * Sign in admin user
   */
  async signIn(credentials: SignInDto): Promise<SignInResponse> {
    const response = await apiClient.POST("/shop/v1/admin/auth/sign-in", {
      body: credentials,
    });

    if (response.error) {
      throw new Error(response.error.message || "Sign in failed");
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    // Store tokens and user role
    const { accessToken, refreshToken } = response.data.data;
    tokenManager.setTokens(accessToken, refreshToken);

    return response.data;
  },

  /**
   * Sign out admin user
   */
  async signOut(): Promise<void> {
    try {
      await apiClient.POST("/shop/v1/admin/auth/sign-out", {});
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      // Clear tokens regardless of API call result
      tokenManager.clearTokens();
    }
  },
};
