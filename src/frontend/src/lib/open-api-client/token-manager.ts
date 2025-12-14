/**
 * Token Manager
 * Handles storage and retrieval of access and refresh tokens
 * Refactored to use Cookies for Middleware compatibility
 */
import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ROLE_KEY = 'userRole';

export enum UserRole {
  ADMIN = 'ADMIN',
  GUEST = 'GUEST'
}


export const tokenManager = {
  // Access Token
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return Cookies.get(ACCESS_TOKEN_KEY) || null;
  },

  setAccessToken(token: string): void {
    Cookies.set(ACCESS_TOKEN_KEY, token, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  },

  // Refresh Token
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return Cookies.get(REFRESH_TOKEN_KEY) || null;
  },

  setRefreshToken(token: string): void {
    Cookies.set(REFRESH_TOKEN_KEY, token, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  },

  // User Role (for Middleware)
  getUserRole(): string | null {
    if (typeof window === 'undefined') return null;
    return Cookies.get(USER_ROLE_KEY) || null;
  },

  setUserRole(role: string): void {
    Cookies.set(USER_ROLE_KEY, role, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  },

  // Set both tokens at once (after login)
  setTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  },

  // Clear all tokens (logout)
  clearTokens(): void {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    Cookies.remove(USER_ROLE_KEY);
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },
};
