import { apiClient, tokenManager } from "@/lib/open-api-client";

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface AuthResponse {
  success: boolean;
  code: number;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      userId: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  };
}

export const authService = {
  /**
   * Client Sign In
   */
  async signIn(data: SignInRequest): Promise<AuthResponse> {
    const response = await apiClient.POST("/shop/v1/client/auth/sign-in", {
      body: data,
    });

    if (response.error) {
      throw new Error(response.error.message || "Sign in failed");
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    // Store tokens
    const { accessToken, refreshToken } = response.data.data;
    tokenManager.setTokens(accessToken, refreshToken);

    return response.data as AuthResponse;
  },

  /**
   * Client Sign Up
   */
  async signUp(data: SignUpRequest): Promise<{ success: boolean; message: string }> {
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
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.POST("/shop/v1/client/auth/refresh-token", {
      body: { refreshToken },
    });

    if (response.error) {
      throw new Error(response.error.message || "Refresh token failed");
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    // Update tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
    tokenManager.setTokens(newAccessToken, newRefreshToken);

    return response.data as AuthResponse;
  },

  /**
   * Sign Out
   */
  signOut(): void {
    tokenManager.clearTokens();
  },
};
