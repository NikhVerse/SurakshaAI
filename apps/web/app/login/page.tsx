"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Logo from "@/components/Logo";

const OPERATORS = [
  { name: "Priya Sharma", email: "analyst@suraksha.ai", role: "HSE Lead Analyst", code: "ANALYST" },
  { name: "Rajesh Verma", email: "manager@suraksha.ai", role: "Operations Manager", code: "MANAGER" },
  { name: "Dr. Aris Thorne", email: "scientist@suraksha.ai", role: "Safety Scientist", code: "SCIENTIST" },
  { name: "Vikramaditya Sen", email: "admin@suraksha.ai", role: "Administrator", code: "ADMIN" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, switchDemoRole } = useAuth();
  const [email, setEmail] = useState("analyst@suraksha.ai");
  const [password, setPassword] = useState("Suraksha@2026");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      router.push("/app/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = async (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("Suraksha@2026");
    setLoading(true);
    setError(null);
    try {
      await switchDemoRole(roleEmail);
      router.push("/app/dashboard");
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-50 py-12 px-6 lg:px-10 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-block transition hover:opacity-90">
          <Logo size="default" />
        </Link>
        <h1 className="text-xl font-black tracking-tight text-slate-900 pt-1">
          Sign In
        </h1>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[11px] font-bold text-slate-500 hover:text-slate-800">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer mt-1 shadow-2xs flex items-center justify-center gap-1.5"
            >
              <span>{loading ? "Authenticating..." : "Sign In"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Quick Operator Switcher */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              Quick Role Sign-In
            </span>
            <div className="grid grid-cols-2 gap-2">
              {OPERATORS.map((u) => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => handleRoleSelect(u.email)}
                  disabled={loading}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-400 text-left transition cursor-pointer flex flex-col justify-between"
                >
                  <span className="font-bold text-slate-900 text-xs truncate">{u.name}</span>
                  <span className="text-[10px] font-mono font-semibold text-slate-500 truncate">{u.role}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center pt-1 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium">
              Need access?{" "}
              <Link href="/signup" className="font-bold text-slate-900 hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
