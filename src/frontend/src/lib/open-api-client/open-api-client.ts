import createClient, { type Middleware } from 'openapi-fetch';
import type { paths } from './open-api';
import { tokenManager } from './token-manager';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

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
        throw new Error('No refresh token found');
      }

      const response = await apiClient.POST('/shop/v1/admin/auth/refresh-token', {
        params: {
          header: {
            'x-refresh-token': refreshToken,
          }
        }
      });

      if (response.error) {
        throw new Error('Token refresh failed');
      }

      if (!response.data) {
        throw new Error('No data returned from token refresh');
      }

      if (!response.data.success) {
        throw new Error('Token refresh was not successful');
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
      if (typeof window !== 'undefined') {
        const loginPath = '/sign-in';
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
 * Auth Middleware - Handles authentication headers and token refresh
 */
const authMiddleware: Middleware = {
  async onRequest({ request }) {
    // Add API key to all requests
    request.headers.set('x-api-key', API_KEY);

    // Add access token if available
    const accessToken = tokenManager.getAccessToken();
    if (accessToken) {
      request.headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return request;
  },

  async onResponse({ response, request }) {
    // Handle 401 Unauthorized - token expired
    if (response.status === 401) {
      try {
        // Attempt to refresh the token
        const newAccessToken = await refreshAccessToken();
        
        // Clone and retry the original request with new token
        const retryRequest = request.clone();
        retryRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
        
        return fetch(retryRequest);
      } catch (error) {
        console.error('❌ Token refresh failed:', error);
        throw error;
      }
    }

    return response;
  },
};

/**
 * Error Handling Middleware
 */
const errorMiddleware: Middleware = {
  async onResponse({ response }) {
    // Handle specific error status codes
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      
      // Try to parse error response
      let errorData = null;
      if (contentType?.includes('application/json')) {
        try {
          errorData = await response.clone().json();
        } catch {
          // Failed to parse JSON
        }
      }

      // Create custom error object
      const error: Record<string, string | number> =(
        errorData?.message || `HTTP ${response.status}: ${response.statusText}`,
        {}
      );
      error.status = response.status;
      error.statusText = response.statusText;
      error.data = errorData;

      // Log errors for debugging
      if (response.status >= 500) {
        console.error('🔴 Server Error:', error);
      } else if (response.status >= 400 && response.status !== 401) {
        console.warn('⚠️ Client Error:', error);
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

/**
 * Helper to check if error is from API
 */
// export function isApiError(error: any): error is { status: number; statusText: string; data: any } {
//   return error && typeof error.status === 'number';
// }

/**
 * Type-safe wrapper for API calls with better error handling
 */
// export async function apiCall<T>(
//   promise: Promise<{ data: T; error: any; response: Response }>
// ): Promise<{ data: T | null; error: any }> {
//   try {
//     const { data, error, response } = await promise;
    
//     if (error || !response.ok) {
//       return { data: null, error: error || new Error('Request failed') };
//     }
    
//     return { data, error: null };
//   } catch (error) {
//     return { data: null, error };
//   }
// }