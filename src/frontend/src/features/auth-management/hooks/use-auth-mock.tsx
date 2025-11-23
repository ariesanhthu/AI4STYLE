"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

// 🎭 MOCK MODE - Để test UI không cần backend
const MOCK_ENABLED = true; // ⚠️ Đổi thành false khi có backend thật

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load user from localStorage on mount
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

    // 🎭 MOCK: Giả lập API call
    await new Promise((resolve) => setTimeout(resolve, 500)); // Fake delay

    if (MOCK_ENABLED) {
      // Mock user data
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

    // Real API call (khi MOCK_ENABLED = false)
    setLoading(false);
    return {
      ok: false,
      error: "Backend chưa sẵn sàng. Bật MOCK_ENABLED = true để test",
    };
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> => {
    setLoading(true);

    // 🎭 MOCK: Giả lập API call
    await new Promise((resolve) => setTimeout(resolve, 500)); // Fake delay

    if (MOCK_ENABLED) {
      // Mock user data
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

    // Real API call (khi MOCK_ENABLED = false)
    setLoading(false);
    return {
      ok: false,
      error: "Backend chưa sẵn sàng. Bật MOCK_ENABLED = true để test",
    };
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
