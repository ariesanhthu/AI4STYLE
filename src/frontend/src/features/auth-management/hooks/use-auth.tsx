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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const accessToken = tokenManager.getAccessToken();

      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Try to get user from localStorage first
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Failed to load user:", err);
        tokenManager.clearTokens();
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.signIn({ email, password });

      // Extract user data from response
      const userData: User = {
        id: response.data.user.userId,
        email: response.data.user.email,
        name: `${response.data.user.firstName} ${response.data.user.lastName}`,
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.data.user.email}`,
        role: response.data.user.role,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      router.push("/");
    } catch (err) {
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
