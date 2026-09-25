"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle, MapPin } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Logo from "@/components/Logo";

const REGIONS = [
  "India - Western Offshore (Mumbai High)",
  "India - Eastern Asset (Assam / Digboi)",
  "India - Northern Hub (Hazira / Gujarat)",
  "India - Southern Basin (KG Basin / Kakinada)",
  "India - Central Asset (Rajasthan / Barmer)",
  "Asia-Pacific Regional Hub (Singapore)",
  "Middle East & Gulf Operations",
  "Global Enterprise / All Assets",
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState(REGIONS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("suraksha_region");
    if (saved && REGIONS.includes(saved)) {
      setRegion(saved);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password, region);
      router.push("/app/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please check your email and password.");
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
        <p className="text-xs text-slate-500 font-medium">
          Enter your registered credentials to access the console
        </p>
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="operator@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[12px] font-bold text-slate-500 hover:text-slate-800">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Operational Region Selection */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Operational Region
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Scopes your telemetry, local incidents, and barrier alerts
              </p>
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
