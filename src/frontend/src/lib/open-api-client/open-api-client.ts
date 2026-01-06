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
// const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";
const API_KEY = "ai4style-dev";

// Debug: Log env values in development (only in browser/client-side)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  if (!API_KEY) {
    console.warn(
      "⚠️ NEXT_PUBLIC_API_KEY is not set. API requests may fail authentication.",
      "\n💡 Solutions:",
      "\n   1. Create .env.local file in src/frontend/ with:",
      "\n      NEXT_PUBLIC_API_KEY=ai4style-dev",
      "\n   2. Or restart dev server after creating .env.local",
      "\n   3. Or use Docker Compose (env is set in docker-compose.yml)"
    );
  } else {
    console.log("✅ NEXT_PUBLIC_API_KEY is set:", API_KEY.substring(0, 10) + "...");
  }
}

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

      // Redirect only for admin area; guest/client pages không auto-reload
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const isAdminRoute = currentPath.startsWith("/admin");
        if (isAdminRoute) {
          const loginPath = "/login";
          window.location.href = loginPath;
        }
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
 * 
 * Note: ApiKeyGuard is applied globally in backend, so ALL endpoints require x-api-key header.
 * Only webhook endpoints (with @Webhook() decorator) are exempted.
 */
const authMiddleware: Middleware = {
  async onRequest({ request }) {
    // Debug: Log API key in development
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      const url = new URL(request.url);
      if (url.pathname.includes("/shop/v1/client/products")) {
        console.log("[authMiddleware] Setting API key:", {
          hasApiKey: !!API_KEY,
          apiKeyLength: API_KEY.length,
          apiKeyPreview: API_KEY ? `${API_KEY.substring(0, 8)}...` : "empty",
          url: request.url,
        });
      }
    }

    // Add API key to all requests (required by backend ApiKeyGuard)
    // Backend will validate and return clear error if missing/invalid
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

  // Handle 401 Unauthorized - token expired or unauthorized
  if (response.status === 401) {
    const url = request.url;

    // 1) Không cố refresh cho client/public endpoints để tránh loop reload homepage
    // Chỉ admin endpoints mới dùng refresh token flow
    const isAdminRequest =
      url.includes("/shop/v1/admin/") || url.includes("/admin/");
    if (!isAdminRequest) {
      // Log 401 error for client endpoints (likely API key issue)
      if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
        const apiKeyHeader = request.headers.get("x-api-key");
        console.error("[customFetch] 401 Unauthorized for client endpoint");
        console.error("URL:", url);
        console.error("API Key Header:", apiKeyHeader ? `${apiKeyHeader.substring(0, 8)}...` : "MISSING");
        console.error("API Key Length:", apiKeyHeader?.length || 0);
        console.error("Expected API Key:", "ai4style-dev");
        console.error("NEXT_PUBLIC_API_KEY from env:", process.env.NEXT_PUBLIC_API_KEY ? `${process.env.NEXT_PUBLIC_API_KEY.substring(0, 8)}...` : "NOT SET");
        console.error("Fix: Set NEXT_PUBLIC_API_KEY=ai4style-dev in .env.local and restart dev server");
      }
      return response;
    }

    // 2) Avoid infinite loop/deadlock: Don't retry if the failed request was the refresh token request itself
    if (url.includes("refresh-token")) {
      return response;
    }

    try {
      // Attempt to refresh the token
      console.log("Refreshing access token...");
      const newAccessToken = await refreshAccessToken();
      console.log("New access token:", newAccessToken);
      // Update Authorization header on the clone
      requestClone.headers.set("Authorization", `Bearer ${newAccessToken}`);

      // Retry with the clone
      return fetch(requestClone);
    } catch (error) {
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
