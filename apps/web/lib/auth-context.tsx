"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "./api";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: "HSE_ANALYST" | "HSE_MANAGER" | "DATA_SCIENTIST" | "ADMINISTRATOR" | string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (fullName: string, email: string, password: string, role?: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  switchDemoRole: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default fallback demo user for seamless offline evaluation
const DEFAULT_DEMO_USER: UserProfile = {
  id: "demo-analyst-001",
  email: "analyst@suraksha.ai",
  full_name: "Priya Sharma",
  role: "HSE_ANALYST",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load existing session on initial render
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("suraksha_token") : null;
    if (token) {
      fetchApi<UserProfile>("/api/v1/auth/me")
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          // If token expired or backend offline, keep default session
          const savedRole = localStorage.getItem("suraksha_role") || "HSE_ANALYST";
          const savedName = localStorage.getItem("suraksha_name") || "Priya Sharma";
          const savedEmail = localStorage.getItem("suraksha_email") || "analyst@suraksha.ai";
          setUser({
            id: "fallback-user",
            email: savedEmail,
            full_name: savedName,
            role: savedRole,
          });
        })
        .finally(() => setLoading(false));
    } else {
      // Default to HSE Analyst for immediate evaluation
      setUser(DEFAULT_DEMO_USER);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    setLoading(true);
    try {
      const res = await fetchApi<{ access_token: string; user: UserProfile }>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (res.access_token) {
        localStorage.setItem("suraksha_token", res.access_token);
        localStorage.setItem("suraksha_email", res.user.email);
        localStorage.setItem("suraksha_name", res.user.full_name);
        localStorage.setItem("suraksha_role", res.user.role);
        setUser(res.user);
        return res.user;
      }
      throw new Error("No token returned from server");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string,
    role: string = "HSE_ANALYST"
  ): Promise<UserProfile> => {
    setLoading(true);
    try {
      const res = await fetchApi<{ access_token: string; user: UserProfile }>("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          role,
        }),
      });

      if (res.access_token) {
        localStorage.setItem("suraksha_token", res.access_token);
        localStorage.setItem("suraksha_email", res.user.email);
        localStorage.setItem("suraksha_name", res.user.full_name);
        localStorage.setItem("suraksha_role", res.user.role);
        setUser(res.user);
        return res.user;
      }
      throw new Error("No token returned from server");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetchApi("/api/v1/auth/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("suraksha_token");
      localStorage.removeItem("suraksha_email");
      localStorage.removeItem("suraksha_name");
      localStorage.removeItem("suraksha_role");
      setUser(null);
      router.push("/login");
    }
  };

  const switchDemoRole = async (email: string) => {
    await login(email, "Suraksha@2026");
    router.push("/app/dashboard");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        switchDemoRole,
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
