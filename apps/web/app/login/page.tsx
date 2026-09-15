"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Logo from "@/components/Logo";

const REAL_DEMO_USERS = [
  {
    name: "Priya Sharma",
    email: "analyst@suraksha.ai",
    role: "HSE Lead Analyst",
    desc: "Evaluates incident triage queue, critical barriers & precursor weak signals.",
  },
  {
    name: "Rajesh Verma",
    email: "manager@suraksha.ai",
    role: "HSE Operations Manager",
    desc: "Reviews operational alerts, sign-offs, action routing & barrier health.",
  },
  {
    name: "Dr. Aris Thorne",
    email: "scientist@suraksha.ai",
    role: "Safety Data Scientist",
    desc: "Inspects model calibration, telemetry & precursor clustering.",
  },
  {
    name: "Vikramaditya Sen",
    email: "admin@suraksha.ai",
    role: "System Administrator",
    desc: "Governs platform configuration, local Ollama endpoints & audit trail.",
  },
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
      setError(err.message || "Invalid email or password.");
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
      setError(err.message || "Authentication error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-50 py-12 px-6 lg:px-10">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-block transition hover:opacity-90">
          <Logo size="default" />
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 pt-2">
          Sign In to Safety Console
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Critical-Risk Intelligence &amp; Calibrated Precursor Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs space-y-6">
          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer mt-2"
            >
              <span>{loading ? "Authenticating..." : "Sign In with Credentials"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* New to SurakshaAI? Sign Up */}
          <div className="text-center pt-1">
            <p className="text-xs text-slate-500 font-medium">
              New to SurakshaAI?{" "}
              <Link href="/signup" className="font-bold text-blue-600 hover:text-blue-700 underline">
                Create an Account (Sign Up)
              </Link>
            </p>
          </div>

          {/* Quick Demo One-Click Access */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              Or Instant Sign-In As Real User
            </span>
            <div className="grid grid-cols-1 gap-2">
              {REAL_DEMO_USERS.map((u) => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => handleRoleSelect(u.email)}
                  disabled={loading}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 text-left transition cursor-pointer text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{u.name}</p>
                    <p className="text-[11px] text-slate-500">{u.role}</p>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600">Select &rarr;</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
