import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "./open-api";
import { tokenManager } from "./token-manager";

// API Configuration
const getBaseUrl = () => {
  let url =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:3001";

  // Remove /shop/v1 suffix if present to prevent double prefixing
  if (url.endsWith("/shop/v1")) {
    url = url.slice(0, -"/shop/v1".length);
  } else if (url.endsWith("/shop/v1/")) {
    url = url.slice(0, -"/shop/v1/".length);
  }

  return url.replace(/\/+$/, "");
};

const API_BASE_URL = getBaseUrl();
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

// Track refresh token promise to prevent multiple refresh calls
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(): Promise<string> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = tokenManager.getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      const response = await apiClient.POST(
        "/shop/v1/admin/auth/refresh-token",
        {
          params: {
            header: {
              "x-refresh-token": refreshToken,
            },
          },
        }
      );

      if (response.error) {
        throw new Error("Token refresh failed");
      }

      if (!response.data) {
        throw new Error("No data returned from token refresh");
      }

      if (!response.data.success) {
        throw new Error("Token refresh was not successful");
      }

      const data = response.data.data;

      // Update tokens in storage
      if (data.accessToken) {
        tokenManager.setAccessToken(data.accessToken);
      }
      if (data.refreshToken) {
        tokenManager.setRefreshToken(data.refreshToken);
      }

      return data.accessToken;
    } catch (error) {
      // Clear tokens and redirect to login on refresh failure
      tokenManager.clearTokens();

      // Redirect to appropriate login page based on role
      if (typeof window !== "undefined") {
        const loginPath = "/";
        window.location.href = loginPath;
      }

      throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Auth Middleware - Handles authentication headers
 */
const authMiddleware: Middleware = {
  async onRequest({ request }) {
    // Add API key to all requests
    request.headers.set("x-api-key", API_KEY);

    // Add access token if available
    const accessToken = tokenManager.getAccessToken();
    if (accessToken) {
      request.headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return request;
  },
};

/**
 * Custom fetch wrapper to handle retries ensuring body is available
 */
const customFetch: typeof fetch = async (input, init) => {
  // If input is a Request object, we can clone it.
  // openapi-fetch passes the Request object as the first argument.
  let request: Request;

  if (input instanceof Request) {
    request = input;
  } else {
    request = new Request(input, init);
  }

  // Clone the request BEFORE it is consumed by fetch
  // This ensures we have a pristine copy for retry
  const requestClone = request.clone();

  const response = await fetch(request);

  // Handle 401 Unauthorized - token expired
  if (response.status === 401) {
    // Avoid infinite loop/deadlock: Don't retry if the failed request was the refresh token request itself
    if (request.url.includes("refresh-token")) {
      return response;
    }

    try {
      // Attempt to refresh the token
      const newAccessToken = await refreshAccessToken();

      // Update Authorization header on the clone
      requestClone.headers.set("Authorization", `Bearer ${newAccessToken}`);

      // Retry with the clone
      return fetch(requestClone);
    } catch (error) {
      console.error("❌ Token refresh failed:", error);
      // Fallback: return the original 401 response so the app can handle logout
      return response;
    }
  }

  return response;
};

/**
 * Error Handling Middleware
 */
const errorMiddleware: Middleware = {
  async onResponse({ response }) {
    // Handle specific error status codes
    if (!response.ok) {
      const contentType = response.headers.get("content-type");

      // Try to parse error response
      let errorData = null;
      if (contentType?.includes("application/json")) {
        try {
          errorData = await response.clone().json();
        } catch {
          // Failed to parse JSON
        }
      }

      // Create custom error object
      const error = {
        message:
          errorData?.message ||
          `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      };

      // Log errors for debugging
      if (response.status >= 500) {
        console.error("🔴 Server Error:", error);
      } else if (response.status >= 400 && response.status !== 401) {
        // 401 is expected during refresh flow, don't spam warning
        console.warn("⚠️ Client Error:", error);
      }
    }

    return response;
  },
};

/**
 * Create API Client with middleware
 */
export function createApiClient() {
  const client = createClient<paths>({
    baseUrl: API_BASE_URL,
    fetch: customFetch,
  });

  // Apply middleware
  client.use(authMiddleware);
  client.use(errorMiddleware);

  return client;
}

/**
 * Default API client instance
 * Use this for making API calls throughout your application
 */
export const apiClient = createApiClient();
