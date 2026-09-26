import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Production project defaults ensuring auth always works even in deployments where env vars aren't injected
const DEFAULT_SUPABASE_URL = "https://tngtkjozfhnjnwvsjnyw.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_ySKCgOZaholzm14A_QN3zQ_KOrQttq1";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const rawKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

const supabaseUrl =
  rawUrl && !rawUrl.includes("[YOUR-PROJECT-REF]") && !rawUrl.includes("YOUR_PROJECT_ID")
    ? rawUrl
    : DEFAULT_SUPABASE_URL;

const supabaseAnonKey =
  rawKey &&
  !rawKey.includes("your-supabase-anon-key") &&
  !rawKey.includes("your-supabase-publishable-key")
    ? rawKey
    : DEFAULT_SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("[YOUR-PROJECT-REF]") &&
  !supabaseUrl.includes("YOUR_PROJECT_ID") &&
  !supabaseAnonKey.includes("your-supabase-anon-key")
);

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// ==============================================================================
// Supabase Authentication Helper Functions
// ==============================================================================

/**
 * Trigger OAuth login with Google
 */
export async function signInWithGoogle(redirectTo?: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured. Please check your Supabase credentials in .env.");
  }
  const targetUrl = redirectTo || (typeof window !== "undefined" ? `${window.location.origin}/app/dashboard` : "/app/dashboard");
  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: targetUrl,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
}

/**
 * Send SMS OTP to phone number
 */
export async function signInWithPhone(phone: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured. Please check your Supabase credentials in .env.");
  }
  return await supabase.auth.signInWithOtp({
    phone,
  });
}

/**
 * Verify SMS OTP
 */
export async function verifyPhoneOtp(phone: string, token: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured. Please check your Supabase credentials in .env.");
  }
  return await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });
}

/**
 * Send Magic link / Email OTP
 */
export async function signInWithEmailOtp(email: string, redirectTo?: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured. Please check your Supabase credentials in .env.");
  }
  const targetUrl = redirectTo || (typeof window !== "undefined" ? `${window.location.origin}/app/dashboard` : "/app/dashboard");
  return await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: targetUrl,
    },
  });
}

/**
 * Verify Email OTP
 */
export async function verifyEmailOtp(email: string, token: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured. Please check your Supabase credentials in .env.");
  }
  return await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
}

/**
 * Sign in with email and password
 */
export async function signInWithPassword(email: string, password: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured. Please check your Supabase credentials in .env.");
  }
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

/**
 * Sign up with email and password
 */
export async function signUpWithPassword(email: string, password: string, metadata?: Record<string, any>) {
  if (!supabase) {
    throw new Error("Supabase is not configured. Please check your Supabase credentials in .env.");
  }
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata || {},
    },
  });
}

/**
 * Sign out of Supabase
 */
export async function signOut() {
  if (!supabase) return;
  return await supabase.auth.signOut();
}
