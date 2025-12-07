"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService } from "../services/auth.service"; // mock test sign in

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthResponse {
  ok: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, name: string) => Promise<AuthResponse>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_ENABLED = false; // mock test sign in

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data", e);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);

    try {
      if (MOCK_ENABLED) {
        // Mock API call for testing
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const mockUser: User = {
          id: "mock-user-123",
          email: email,
          name: "John Doe",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + email,
        };
        const mockToken = "mock-token-" + Date.now();

        setUser(mockUser);
        setToken(mockToken);
        localStorage.setItem("token", mockToken);
        localStorage.setItem("user", JSON.stringify(mockUser));

        setLoading(false);
        return { ok: true };
      }

      // Real API call
      const response = await authService.login(email, password);
      
      // Extract user data from response
      const userData: User = {
        id: response.data.user.userId,
        email: response.data.user.email,
        name: `${response.data.user.firstName} ${response.data.user.lastName}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.data.user.email}`,
      };

      setUser(userData);
      setToken(response.data.accessToken);
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setLoading(false);
      return { ok: true };
    } catch (error) {
      setLoading(false);
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> => {
    setLoading(true);

    try {
      if (MOCK_ENABLED) {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const mockUser: User = {
          id: "mock-user-" + Date.now(),
          email: email,
          name: name,
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + email,
        };
        const mockToken = "mock-token-" + Date.now();

        setUser(mockUser);
        setToken(mockToken);
        localStorage.setItem("token", mockToken);
        localStorage.setItem("user", JSON.stringify(mockUser));

        setLoading(false);
        return { ok: true };
      }

      // Real API call
      await authService.register(email, password, name);

      setLoading(false);
      return { ok: true };
    } catch (error) {
      setLoading(false);
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
