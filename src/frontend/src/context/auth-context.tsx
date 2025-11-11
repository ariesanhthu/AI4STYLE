"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiPost, apiGet } from "@/lib/api-client";
import { useRouter } from "next/navigation";

// Types
export type User = {
  id: string;
  email: string;
  name?: string;
  [key: string]: any;
} | null;

type AuthContextType = {
  user: User;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (email: string, password: string, name?: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Constants
const TOKEN_KEY = "auth_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(() => 
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch user profile on mount or when token changes
  useEffect(() => {
    async function fetchProfile() {
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const { data, error } = await apiGet<User>("/auth/me", token);
        if (error || !data) {
          // Token invalid, clear it
          setUser(null);
          setToken(null);
          localStorage.removeItem(TOKEN_KEY);
          return;
        }
        setUser(data);
      } catch {
        setUser(null);
      }
    }

    fetchProfile();
  }, [token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await apiPost<{ token: string; user: User }>(
      "/auth/login",
      { email, password }
    );
    setLoading(false);

    if (error || !data) {
      return { ok: false, error: error || "Đăng nhập thất bại" };
    }

    setToken(data.token);
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    return { ok: true };
  };

  const register = async (email: string, password: string, name?: string) => {
    setLoading(true);
    const { data, error } = await apiPost<{ token: string; user: User }>(
      "/auth/register",
      { email, password, name }
    );
    setLoading(false);

    if (error || !data) {
      return { ok: false, error: error || "Đăng ký thất bại" };
    }

    setToken(data.token);
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    router.push("/");
  };

  const refreshUser = async () => {
    if (!token) return;
    const { data } = await apiGet<User>("/auth/me", token);
    if (data) setUser(data);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
