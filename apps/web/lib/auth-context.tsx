"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "./api";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  role: string;
  account_status?: string;
  profile_image?: string | null;
  created_at?: string;
  last_login_at?: string | null;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (
    fullName: string,
    email: string,
    password: string,
    role?: string,
    phone?: string
  ) => Promise<UserProfile>;
  updateProfile: (data: { full_name?: string; phone?: string; profile_image?: string }) => Promise<UserProfile>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Authenticate existing session on initial load
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("suraksha_token") : null;
    if (token) {
      fetchApi<UserProfile>("/api/v1/auth/me")
        .then((userData) => {
          if (userData && userData.id) {
            setUser(userData);
          } else {
            // Invalid session
            localStorage.removeItem("suraksha_token");
            localStorage.removeItem("suraksha_email");
            localStorage.removeItem("suraksha_name");
            localStorage.removeItem("suraksha_role");
            setUser(null);
          }
        })
        .catch(() => {
          // Token invalid or expired
          localStorage.removeItem("suraksha_token");
          localStorage.removeItem("suraksha_email");
          localStorage.removeItem("suraksha_name");
          localStorage.removeItem("suraksha_role");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    setLoading(true);
    try {
      const res = await fetchApi<{ access_token: string; user: UserProfile }>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (res && res.access_token && res.user) {
        localStorage.setItem("suraksha_token", res.access_token);
        localStorage.setItem("suraksha_email", res.user.email);
        localStorage.setItem("suraksha_name", res.user.full_name);
        localStorage.setItem("suraksha_role", res.user.role);
        setUser(res.user);
        return res.user;
      }
      throw new Error("Invalid response received from authentication service.");
    } catch (err: any) {
      setUser(null);
      throw new Error(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string,
    role: string = "HSE_ANALYST",
    phone?: string
  ): Promise<UserProfile> => {
    setLoading(true);
    try {
      const res = await fetchApi<{ access_token: string; user: UserProfile }>("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          password,
          role,
          phone: phone ? phone.trim() : undefined,
        }),
      });

      if (res && res.access_token && res.user) {
        localStorage.setItem("suraksha_token", res.access_token);
        localStorage.setItem("suraksha_email", res.user.email);
        localStorage.setItem("suraksha_name", res.user.full_name);
        localStorage.setItem("suraksha_role", res.user.role);
        setUser(res.user);
        return res.user;
      }
      throw new Error("Registration failed: could not create account.");
    } catch (err: any) {
      throw new Error(err.message || "Registration failed. An account with this email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: { full_name?: string; phone?: string; profile_image?: string }): Promise<UserProfile> => {
    const updated = await fetchApi<UserProfile>("/api/v1/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (updated) {
      setUser(updated);
      localStorage.setItem("suraksha_name", updated.full_name);
    }
    return updated;
  };

  const logout = async () => {
    try {
      await fetchApi("/api/v1/auth/logout", { method: "POST" });
    } catch {
      // offline logout
    } finally {
      localStorage.removeItem("suraksha_token");
      localStorage.removeItem("suraksha_email");
      localStorage.removeItem("suraksha_name");
      localStorage.removeItem("suraksha_role");
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateProfile,
        logout,
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
