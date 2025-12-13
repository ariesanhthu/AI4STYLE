"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { authService } from "../services/auth.service";
import { tokenManager } from "@/lib/open-api-client";
import { useRouter } from "next/navigation";
import { ChangePasswordRequest, ErrorResponse, SignInRequest, SignUpRequest, ProfileResponse as User } from "../types/auth";
import { UpdateProfileRequest } from "@/features/user-profile";
import { UserRole } from "@/lib/open-api-client/token-manager";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  signIn: (data: SignInRequest) => Promise<void>;
  signUp: (data: SignUpRequest) => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  updateUser: (data: UpdateProfileRequest) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // State matching useAdminAuth style
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const router = useRouter();

  // Load user from local storage initially to avoid flicker
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAdmin(parsedUser.role?.type !== "guest");
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    // Set loading to true initially, fetchUser will set it to false when done
    setIsLoading(true);
  }, []);

  /**
   * Fetch current user data
   */
  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const accessToken = tokenManager.getAccessToken();
      if (!accessToken) {
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem("user");
        setIsLoading(false);
        return;
      }

      // Try to get user from localStorage first for immediate display
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAdmin(parsedUser.role?.type !== "guest");
        } catch { /* ignore */ }
      }

      // Then fetch fresh data from API
      const userData = await authService.getProfile();
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // Set user role cookie for middleware
      const isUserAdmin = userData.role?.type !== "guest";
      setIsAdmin(isUserAdmin);
      tokenManager.setUserRole(isUserAdmin ? UserRole.ADMIN : UserRole.GUEST);

    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch user");
      setIsError(true);
      setError(error);
      if ((err as ErrorResponse)?.code === 401) {
        signOut();
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ... (signIn, signUp, etc. reuse fetchUser or update user state similarly)

  // Update signOut to reset isAdmin
  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setIsAdmin(false);
      localStorage.removeItem("user");
      tokenManager.clearTokens();
      console.log("[USE AUTH] Signed out, redirecting to login");
      router.push("/");
    } catch (err) {
      console.error("Sign out failed", err);
      setUser(null);
      setIsAdmin(false);
      localStorage.removeItem("user");
      tokenManager.clearTokens();
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Update updateUser to update isAdmin if role changes (unlikely for client but good practice)
  const updateUser = useCallback(async (updateProfileRequest: UpdateProfileRequest) => {
    setIsLoading(true);
    try {
      const updatedUser = await authService.updateProfile(updateProfileRequest);
      setUser(updatedUser);
      setIsAdmin(updatedUser.role?.type !== "guest");
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      // ...
      const error = err instanceof Error ? err : new Error("Failed to update profile");
      setIsError(true);
      setError(error);
      console.error("Failed to update user:", err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ...



  /**
   * Sign In
   */
  const signIn = useCallback(async (data: SignInRequest) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      console.log("[USE AUTH] Signing in with:", data);
      await authService.signIn(data);
      console.log("[USE AUTH] Sign in success");

      // Fetch user profile immediately after sign in
      await fetchUser();

      router.push("/");
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Sign in failed");
      setIsError(true);
      setError(error);
      console.error("[USE AUTH] Sign in error:", err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router, fetchUser]);

  /**
   * Sign Up
   */
  const signUp = useCallback(async (data: SignUpRequest) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      await authService.signUp(data);
      // Auto login after signup
      await signIn(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Sign up failed");
      setIsError(true);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [signIn]);

  /**
   * Change Password
   */
  const changePassword = useCallback(async (changePasswordRequest: ChangePasswordRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.changePassword(changePasswordRequest);
      if (!response.success) {
        throw new Error('Change password failed');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to change password");
      console.error("Failed to change password:", err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh User (Explicit re-fetch)
   */
  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  // Initial fetch on mount
  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const isAuthenticated = !!user;
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isAuthenticated,
        isLoading,
        isError,
        error,
        signIn,
        signUp,
        signOut,
        changePassword,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
