/**
 * API Client Module
 * 
 * This module provides a type-safe API client for the application.
 * It includes automatic token refresh, error handling, and type inference.
 * 
 * @example
 * ```typescript
 * import { apiClient, tokenManager } from '@/lib/api-client';
 * 
 * // Make API calls
 * const { data, error } = await apiClient.GET('/shop/v1/admin/product/{id}', {
 *   params: { path: { id: '123' } }
 * });
 * 
 * // Manage tokens
 * tokenManager.setTokens(accessToken, refreshToken, 'admin');
 * ```
 */

export { 
  apiClient, 
  createApiClient, 
  apiCall, 
  isApiError 
} from './open-api-client';

export { 
  tokenManager, 
} from './token-manager';

export type { paths } from './open-api';
