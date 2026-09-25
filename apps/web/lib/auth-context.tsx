"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "./api";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  age?: number | null;
  dob?: string | null;
  gender?: string | null;
  region?: string | null;
  phone?: string | null;
  role: string;
  account_status?: string;
  profile_image?: string | null;
  created_at?: string;
  last_login_at?: string | null;
}

export interface RegisterPayload {
  first_name: string;
  middle_name?: string;
  last_name: string;
  age: number;
  dob: string;
  gender: string;
  role: string;
  email: string;
  password: string;
  region?: string;
  phone?: string;
  full_name?: string;
}

export interface UpdateProfilePayload {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  age?: number;
  dob?: string;
  gender?: string;
  role?: string;
  region?: string;
  full_name?: string;
  phone?: string;
  profile_image?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string, region?: string) => Promise<UserProfile>;
  register: (
    dataOrFullName: string | RegisterPayload,
    email?: string,
    password?: string,
    role?: string,
    phone?: string
  ) => Promise<UserProfile>;
  updateProfile: (data: UpdateProfilePayload) => Promise<UserProfile>;
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
            if (userData.region) localStorage.setItem("suraksha_region", userData.region);
          } else {
            // Invalid session
            localStorage.removeItem("suraksha_token");
            localStorage.removeItem("suraksha_email");
            localStorage.removeItem("suraksha_name");
            localStorage.removeItem("suraksha_role");
            localStorage.removeItem("suraksha_region");
            setUser(null);
          }
        })
        .catch(() => {
          // Token invalid or expired
          localStorage.removeItem("suraksha_token");
          localStorage.removeItem("suraksha_email");
          localStorage.removeItem("suraksha_name");
          localStorage.removeItem("suraksha_role");
          localStorage.removeItem("suraksha_region");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, region?: string): Promise<UserProfile> => {
    setLoading(true);
    try {
      const res = await fetchApi<{ access_token: string; user: UserProfile }>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
          region: region ? region.trim() : undefined,
        }),
      });

      if (res && res.access_token && res.user) {
        localStorage.setItem("suraksha_token", res.access_token);
        localStorage.setItem("suraksha_email", res.user.email);
        localStorage.setItem("suraksha_name", res.user.full_name);
        localStorage.setItem("suraksha_role", res.user.role);
        if (res.user.region || region) {
          localStorage.setItem("suraksha_region", res.user.region || region || "");
        }
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
    dataOrFullName: string | RegisterPayload,
    email?: string,
    password?: string,
    role: string = "HSE_ANALYST",
    phone?: string
  ): Promise<UserProfile> => {
    setLoading(true);
    try {
      let payload: any;
      if (typeof dataOrFullName === "object") {
        payload = dataOrFullName;
      } else {
        payload = {
          full_name: dataOrFullName.trim(),
          first_name: dataOrFullName.trim().split(" ")[0] || "User",
          last_name: dataOrFullName.trim().split(" ").slice(1).join(" ") || "Member",
          age: 28,
          dob: "01-Jan-1998",
          gender: "OTHER",
          email: email?.trim(),
          password,
          role,
          phone: phone ? phone.trim() : undefined,
        };
      }

      const res = await fetchApi<{ access_token: string; user: UserProfile }>("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res && res.access_token && res.user) {
        localStorage.setItem("suraksha_token", res.access_token);
        localStorage.setItem("suraksha_email", res.user.email);
        localStorage.setItem("suraksha_name", res.user.full_name);
        localStorage.setItem("suraksha_role", res.user.role);
        if (res.user.region) localStorage.setItem("suraksha_region", res.user.region);
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

  const updateProfile = async (data: UpdateProfilePayload): Promise<UserProfile> => {
    const updated = await fetchApi<UserProfile>("/api/v1/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (updated) {
      setUser(updated);
      localStorage.setItem("suraksha_name", updated.full_name);
      if (updated.region) localStorage.setItem("suraksha_region", updated.region);
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
