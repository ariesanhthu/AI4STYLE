import { SignInResponse } from "@/features/auth/sign-in";
import { apiClient, tokenManager } from "@/lib/open-api-client";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export const authService = {
  // /**
  //  * Request password reset
  //  */
  // async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
  //   return apiClient<{ message: string }>(`${BASE_URL}/auth/forgot-password`, {
  //     method: "POST",
  //     body: JSON.stringify(data),
  //   });
  // },

  // /**
  //  * Reset password with token
  //  */
  // async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
  //   return apiClient<{ message: string }>(`${BASE_URL}/auth/reset-password`, {
  //     method: "POST",
  //     body: JSON.stringify(data),
  //   });
  // },

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<SignInResponse> {
    const response = await apiClient.POST("/shop/v1/admin/auth/sign-in", {
      body: {
        email,
        password,
      },
    });

    if (response.error) {
      throw new Error(response.error.message || "Sign in failed");
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }
    console.log("response.data", response.data);
    // Store tokens and user role
    const { accessToken, refreshToken } = response.data.data;
    tokenManager.setTokens(accessToken, refreshToken);

    return response.data;
  },

  /**
   * Register new user (Guest/Customer)
   */
  async register(
    email: string,
    password: string,
    name: string
  ): Promise<any> {
    const response = await apiClient.POST("/shop/v1/client/auth/sign-up", {
      body: {
        email,
        password,
        name,
      },
    });

    if (response.error) {
      throw new Error(response.error.message || "Sign up failed");
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  },
};
