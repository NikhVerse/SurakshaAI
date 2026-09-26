"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  isSupabaseConfigured,
  supabase,
  signInWithGoogle as supaSignInWithGoogle,
  signInWithPhone as supaSignInWithPhone,
  verifyPhoneOtp as supaVerifyPhoneOtp,
  signInWithEmailOtp as supaSignInWithEmailOtp,
  verifyEmailOtp as supaVerifyEmailOtp,
  signInWithPassword as supaSignInWithPassword,
  signUpWithPassword as supaSignUpWithPassword,
  signOut as supaSignOut,
} from "./supabase";

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
  loginWithGoogle: (redirectTo?: string) => Promise<void>;
  loginWithPhone: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<UserProfile>;
  loginWithEmailOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyEmailOtp: (email: string, token: string) => Promise<UserProfile>;
  updateProfile: (data: UpdateProfilePayload) => Promise<UserProfile>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUserToProfile(supaUser: any, extraRegion?: string): UserProfile {
  const meta = supaUser.user_metadata || {};
  const email = supaUser.email || "";
  const fallbackName =
    meta.full_name ||
    meta.name ||
    (meta.first_name ? `${meta.first_name} ${meta.last_name || ""}`.trim() : "") ||
    (email ? email.split("@")[0].replace(/[._]/g, " ") : "Operator");

  return {
    id: supaUser.id,
    email,
    full_name: fallbackName,
    first_name: meta.first_name || (fallbackName.split(" ")[0] || "Operator"),
    middle_name: meta.middle_name || null,
    last_name: meta.last_name || (fallbackName.split(" ").slice(1).join(" ") || "User"),
    age: meta.age || 28,
    dob: meta.dob || "01-Jan-1998",
    gender: meta.gender || "Other",
    role: meta.role || "HSE_ANALYST",
    region: extraRegion || meta.region || "India - Western Offshore (Mumbai High)",
    phone: supaUser.phone || meta.phone || null,
    account_status: "ACTIVE",
    profile_image: meta.avatar_url || meta.picture || null,
    created_at: supaUser.created_at || new Date().toISOString(),
    last_login_at: supaUser.last_sign_in_at || new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const clearStorage = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("suraksha_token");
    localStorage.removeItem("suraksha_email");
    localStorage.removeItem("suraksha_name");
    localStorage.removeItem("suraksha_role");
    localStorage.removeItem("suraksha_region");
    localStorage.removeItem("suraksha_user");
  };

  const persistProfile = (profile: UserProfile, token?: string) => {
    if (typeof window === "undefined") return;
    if (token) localStorage.setItem("suraksha_token", token);
    localStorage.setItem("suraksha_email", profile.email);
    localStorage.setItem("suraksha_name", profile.full_name);
    localStorage.setItem("suraksha_role", profile.role);
    if (profile.region) localStorage.setItem("suraksha_region", profile.region);
    localStorage.setItem("suraksha_user", JSON.stringify(profile));
    setUser(profile);
  };

  // Initialize and listen to Supabase Auth state changes
  useEffect(() => {
    // 1. Initial cached profile for instantaneous rendering
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("suraksha_user");
        if (cached) {
          setUser(JSON.parse(cached));
        }
      } catch {}
    }

    // 2. Supabase Auth Session Validation
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const profile = mapSupabaseUserToProfile(session.user);
          persistProfile(profile, session.access_token);
        } else {
          // If no active Supabase session exists, clear local state
          clearStorage();
          setUser(null);
        }
        setLoading(false);
      }).catch((err) => {
        console.warn("Supabase session check error:", err);
        setLoading(false);
      });

      // 3. Live auth state changes (OAuth login, OTP, signout, token refresh)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (session?.user) {
            const profile = mapSupabaseUserToProfile(session.user);
            persistProfile(profile, session.access_token);
          } else if (event === "SIGNED_OUT") {
            clearStorage();
            setUser(null);
          }
          setLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Primary Login via Supabase Auth
   */
  const login = async (email: string, password: string, region?: string): Promise<UserProfile> => {
    setLoading(true);
    const cleanEmail = email.trim();

    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      throw new Error("Supabase is not configured. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.");
    }

    try {
      const { data, error } = await supaSignInWithPassword(cleanEmail, password);
      if (error) {
        // If user is not yet created, attempt automatic signup for friction-free onboarding
        if (error.message.toLowerCase().includes("invalid login credentials")) {
          const { data: signData, error: signError } = await supaSignUpWithPassword(cleanEmail, password, {
            full_name: cleanEmail.split("@")[0].replace(/[._]/g, " "),
            region: region || "India - Western Offshore (Mumbai High)",
            role: "HSE_ANALYST",
          });

          if (signError) {
            throw new Error(signError.message || "Invalid email or password.");
          }

          if (signData?.user) {
            const profile = mapSupabaseUserToProfile(signData.user, region);
            persistProfile(profile, signData.session?.access_token);
            return profile;
          }
        }
        throw new Error(error.message);
      }

      if (!data?.user) {
        throw new Error("No user returned from Supabase authentication.");
      }

      if (region) {
        try {
          await supabase.auth.updateUser({
            data: { region },
          });
          await supabase.from("users").update({
            region,
            last_login_at: new Date().toISOString(),
          }).eq("id", data.user.id);
        } catch (regionErr) {
          console.warn("Notice updating user region in Supabase:", regionErr);
        }
      }

      const profile = mapSupabaseUserToProfile(data.user, region);
      persistProfile(profile, data.session?.access_token);
      return profile;
    } catch (err: any) {
      throw new Error(err.message || "Authentication failed via Supabase.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Primary Register via Supabase Auth
   */
  const register = async (
    dataOrFullName: string | RegisterPayload,
    email?: string,
    password?: string,
    role: string = "HSE_ANALYST",
    phone?: string
  ): Promise<UserProfile> => {
    setLoading(true);

    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      throw new Error("Supabase is not configured. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.");
    }

    try {
      let payload: RegisterPayload;
      if (typeof dataOrFullName === "object") {
        payload = dataOrFullName;
      } else {
        payload = {
          full_name: dataOrFullName.trim(),
          first_name: dataOrFullName.trim().split(" ")[0] || "Operator",
          last_name: dataOrFullName.trim().split(" ").slice(1).join(" ") || "User",
          age: 28,
          dob: "01-Jan-1998",
          gender: "Other",
          email: email?.trim() || "",
          password: password || "",
          role,
          phone: phone ? phone.trim() : undefined,
        };
      }

      const { data, error } = await supaSignUpWithPassword(payload.email, payload.password, {
        full_name: payload.full_name || `${payload.first_name} ${payload.last_name}`.trim(),
        first_name: payload.first_name,
        middle_name: payload.middle_name,
        last_name: payload.last_name,
        age: payload.age,
        dob: payload.dob,
        gender: payload.gender,
        role: payload.role,
        region: payload.region,
        phone: payload.phone,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.user) {
        try {
          await supabase.from("users").upsert({
            id: data.user.id,
            email: payload.email,
            full_name: payload.full_name || `${payload.first_name} ${payload.last_name}`.trim(),
            first_name: payload.first_name,
            middle_name: payload.middle_name || null,
            last_name: payload.last_name,
            age: payload.age,
            dob: payload.dob,
            gender: payload.gender,
            role: payload.role,
            region: payload.region,
            phone: payload.phone || null,
            account_status: "ACTIVE",
            is_active: true,
          });
        } catch (tableErr) {
          console.warn("Notice on Supabase users table upsert:", tableErr);
        }
      }

      const profile = mapSupabaseUserToProfile(data.user, payload.region);
      persistProfile(profile, data.session?.access_token);
      return profile;
    } catch (err: any) {
      throw new Error(err.message || "Registration failed via Supabase.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign in with Google via Supabase OAuth
   */
  const loginWithGoogle = async (redirectTo?: string) => {
    setLoading(true);
    try {
      await supaSignInWithGoogle(redirectTo);
    } catch (err: any) {
      setLoading(false);
      throw new Error(err.message || "Google sign in failed.");
    }
  };

  /**
   * Send Phone OTP via Supabase
   */
  const loginWithPhone = async (phone: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supaSignInWithPhone(phone);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to send SMS code." };
    }
  };

  /**
   * Verify Phone OTP via Supabase
   */
  const verifyPhoneOtp = async (phone: string, token: string): Promise<UserProfile> => {
    setLoading(true);
    try {
      const { data, error } = await supaVerifyPhoneOtp(phone, token);
      if (error || !data.user) {
        throw new Error(error?.message || "Invalid or expired verification code.");
      }
      const profile = mapSupabaseUserToProfile(data.user);
      persistProfile(profile, data.session?.access_token);
      return profile;
    } catch (err: any) {
      throw new Error(err.message || "Verification code validation failed.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Send Email OTP / Magic Link via Supabase
   */
  const loginWithEmailOtp = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supaSignInWithEmailOtp(email);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to send login code." };
    }
  };

  /**
   * Verify Email OTP code via Supabase
   */
  const verifyEmailOtp = async (email: string, token: string): Promise<UserProfile> => {
    setLoading(true);
    try {
      const { data, error } = await supaVerifyEmailOtp(email, token);
      if (error || !data.user) {
        throw new Error(error?.message || "Invalid or expired verification code.");
      }
      const profile = mapSupabaseUserToProfile(data.user);
      persistProfile(profile, data.session?.access_token);
      return profile;
    } catch (err: any) {
      throw new Error(err.message || "Verification code validation failed.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update Profile in Supabase User Metadata
   */
  const updateProfile = async (data: UpdateProfilePayload): Promise<UserProfile> => {
    if (!supabase) throw new Error("Supabase is not configured.");

    const { data: supaData, error } = await supabase.auth.updateUser({
      data: {
        ...data,
      },
    });

    if (error || !supaData.user) {
      throw new Error(error?.message || "Failed to update profile in Supabase.");
    }

    const updatedProfile = mapSupabaseUserToProfile(supaData.user, data.region);
    persistProfile(updatedProfile);
    return updatedProfile;
  };

  /**
   * Logout exclusively through Supabase
   */
  const logout = async () => {
    try {
      await supaSignOut();
    } catch (err) {
      console.warn("Supabase sign out notice:", err);
    } finally {
      clearStorage();
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
        loginWithGoogle,
        loginWithPhone,
        verifyPhoneOtp,
        loginWithEmailOtp,
        verifyEmailOtp,
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
