import { apiClient, tokenManager } from "@/lib/open-api-client";
import { ChangePasswordRequest, ChangePasswordResponse, ProfileResponse, SignInRequest, SignInResponse, SignUpRequest, SignUpResponse, UpdateProfileRequest } from "../types/auth";

export const authService = {
  /**
   * Client Sign In
   */
  async signIn(data: SignInRequest): Promise<SignInResponse> {
    const response = await apiClient.POST("/shop/v1/client/auth/sign-in", {
      body: data,
    });

    console.log("[AUTH SERVICE] Sign in response:", response);

    if (response.error) {
      console.error("[AUTH SERVICE] Sign in error:", response.error);
      throw new Error(response.error.message || "Sign in failed");
    }

    if (!response.data) {
      console.error("[AUTH SERVICE] No data in response");
      throw new Error("No data received from server");
    }

    console.log("[AUTH SERVICE] Response data:", response.data);
    console.log("[AUTH SERVICE] Response data.data:", response.data.data);

    // Store tokens
    const { accessToken, refreshToken } = response.data.data || response.data;
    console.log("[AUTH SERVICE] Tokens:", { accessToken: accessToken?.substring(0, 20) + "...", refreshToken: refreshToken?.substring(0, 20) + "..." });
    
    tokenManager.setTokens(accessToken, refreshToken);
    console.log("[AUTH SERVICE] Tokens stored successfully");

    return response.data.data;
  },

  /**
   * Client Sign Up
   */
  async signUp(data: SignUpRequest): Promise<SignUpResponse> {
    const response = await apiClient.POST("/shop/v1/client/auth/sign-up", {
      body: data,
    });

    if (response.error) {
      throw new Error(response.error.message || "Sign up failed");
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data.data;
  },

  /**
   * Refresh Token
   */
  // async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
  //   const response = await apiClient.POST("/shop/v1/client/auth/refresh-token", {
  //     headers: { 
  //       "Authorization": `Bearer ${refreshToken}`,
  //     },
  //   });

  //   if (response.error) {
  //     throw new Error(response.error.message || "Refresh token failed");
  //   }

  //   if (!response.data) {
  //     throw new Error("No data received from server");
  //   }

  //   // Update tokens
  //   const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
  //   tokenManager.setTokens(newAccessToken, newRefreshToken);

  //   return response.data as AuthResponse;
  // },

  /**
   * Sign Out
   */
  async signOut(): Promise<void> {
    tokenManager.clearTokens();
    const response = await apiClient.POST("/shop/v1/client/auth/sign-out");
    if (response.error) {
      console.error("[AUTH SERVICE] Sign out error:", response.error);
    }
    if (response.data?.data) {
      console.log("[AUTH SERVICE] Sign out response:", response.data.data);
    }
    return;
  },

  async getProfile(): Promise<ProfileResponse> {
    const response = await apiClient.GET("/shop/v1/client/users/profile");
    if (response.error) {
      throw new Error(response.error.message || "Get profile failed");
    }
    if (!response.data) {
      throw new Error("No data received from server");
    }
    return response.data.data;
  },

  async updateProfile(body: UpdateProfileRequest): Promise<ProfileResponse> {
    const data = await apiClient.PATCH('/shop/v1/client/users/profile', {body});
    if (data.error) {
      throw data.error
    }
    return data.data.data
  },

  /**
   * Change password
   */
  async changePassword(body: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    const data = await apiClient.POST('/shop/v1/client/auth/change-password', {body});
    if (data.error) {
      throw data.error
    }
    return data.data.data
  },  
};
