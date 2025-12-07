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
