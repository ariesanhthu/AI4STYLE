"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { authService } from "../services/auth.service";
import { tokenManager } from "@/lib/open-api-client";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone: string) => Promise<void>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Start with null to match server render - will load from localStorage in useEffect
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const accessToken = tokenManager.getAccessToken();
      console.log("[AUTH] Loading user, token exists:", !!accessToken);

      if (!accessToken) {
        console.log("[AUTH] No token found, setting loading false");
        setIsLoading(false);
        return;
      }

      try {
        // Try to get user from localStorage first
        const storedUser = localStorage.getItem("user");
        console.log("[AUTH] Stored user:", storedUser);
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          console.log("[AUTH] User loaded:", userData);
        }
      } catch (err) {
        console.error("[AUTH] Failed to load user:", err);
        tokenManager.clearTokens();
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
        console.log("[AUTH] Loading complete");
      }
    };

    loadUser();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("[USE AUTH] Signing in with:", email);
      const response = await authService.signIn({ email, password });
      console.log("[USE AUTH] Sign in response received");

      // Backend only returns tokens, create user data from email
      // TODO: Call a separate API to get user profile details
      const userData: User = {
        id: "temp-id", // Will be updated when profile API is called
        email: email,
        name: email.split("@")[0], // Use email prefix as temporary name
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };

      console.log("[USE AUTH] Setting user:", userData);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("[USE AUTH] User saved, redirecting to home");
      
      router.push("/");
    } catch (err) {
      console.error("[USE AUTH] Sign in error:", err);
      const message = err instanceof Error ? err.message : "Sign in failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const signUp = useCallback(async (email: string, password: string, name: string, phone: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.signUp({ email, password, name, phone });

      // Auto login after signup
      await signIn(email, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign up failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [signIn]);

  const signOut = useCallback(() => {
    authService.signOut();
    setUser(null);
    localStorage.removeItem("user");
    console.log("[USE AUTH] Signed out, redirecting to login");
    router.push("/login");
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      // Will be implemented when profile service is ready
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  }, []);

  // ✅ FIX: Check authentication properly
  // User is authenticated if:
  // 1. We have a token
  // 2. We have user data (already loaded from localStorage)
  const hasToken = !!tokenManager.getAccessToken();
  const isAuthenticated = hasToken && !!user;

  console.log("[AUTH PROVIDER] State:", { 
    hasToken, 
    hasUser: !!user, 
    isAuthenticated, 
    isLoading 
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        signIn,
        signUp,
        signOut,
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
