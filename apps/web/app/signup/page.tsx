"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  User,
  Shield,
  ArrowRight,
  AlertCircle,
  Calendar,
  MapPin,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Logo from "@/components/Logo";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const ROLES = [
  { value: "HSE_ANALYST", label: "HSE Lead Analyst (Triage & Risk)" },
  { value: "HSE_MANAGER", label: "HSE Operations Manager (Sign-Off & Audits)" },
  { value: "SAFETY_ENGINEER", label: "Process Safety Engineer (Barriers & LOTO)" },
  { value: "FIELD_SUPERVISOR", label: "Field Operations Supervisor (Permit-to-Work)" },
  { value: "DATA_SCIENTIST", label: "Safety Data Scientist (MLOps & Models)" },
  { value: "ADMINISTRATOR", label: "System Administrator (Full Console Access)" },
];

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

export default function SignUpPage() {
  const router = useRouter();
  const { register } = useAuth();

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [dobRaw, setDobRaw] = useState(""); // YYYY-MM-DD from HTML date input
  const [dobFormatted, setDobFormatted] = useState(""); // dd-mmm-yyyy
  const [gender, setGender] = useState<"M" | "F" | "Other">("M");
  const [role, setRole] = useState("HSE_ANALYST");
  const [region, setRegion] = useState(REGIONS[0]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert YYYY-MM-DD into dd-mmm-yyyy
  const handleDateChange = (dateVal: string) => {
    setDobRaw(dateVal);
    if (!dateVal) {
      setDobFormatted("");
      return;
    }
    const [year, month, day] = dateVal.split("-");
    const mIdx = parseInt(month, 10) - 1;
    if (mIdx >= 0 && mIdx < 12) {
      const formatted = `${day}-${MONTH_NAMES[mIdx]}-${year}`;
      setDobFormatted(formatted);

      // Auto-compute approximate age if not yet entered
      if (!age) {
        const birthDate = new Date(parseInt(year, 10), mIdx, parseInt(day, 10));
        const diffYears = Math.floor(
          (Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
        );
        if (diffYears >= 20 && diffYears <= 100) {
          setAge(diffYears);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!firstName.trim()) {
      setError("First Name is mandatory.");
      return;
    }
    if (!lastName.trim()) {
      setError("Last Name is mandatory.");
      return;
    }
    const numAge = Number(age);
    if (isNaN(numAge) || numAge < 20 || numAge > 100) {
      setError("Age must be between 20 and 100.");
      return;
    }
    if (!dobFormatted) {
      setError("Date of Birth (DOB) is mandatory in dd-mmm-yyyy format.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("A valid Email Address is mandatory.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);

    try {
      await register({
        first_name: firstName.trim(),
        middle_name: middleName.trim() || undefined,
        last_name: lastName.trim(),
        age: numAge,
        dob: dobFormatted,
        gender,
        role,
        region,
        email: email.trim(),
        password,
      });
      router.push("/app/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-1.5">
        <Link href="/" className="inline-block transition hover:opacity-90">
          <Logo size="default" />
        </Link>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 pt-2">
          Create Authorized Operator Account
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Register for critical-risk evaluation &amp; precursor intelligence console
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-800 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* 1. Name Row: First, Middle, Last */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Full Legal Identity
                </label>
                <span className="text-[10px] text-slate-400">* Required fields</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="First Name *"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Middle Name (Optional)"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="Last Name *"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* 2. Personal Details Row: Age (20-100), DOB (dd-mmm-yyyy), Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Age */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Age (20 – 100) *
                </label>
                <input
                  type="number"
                  required
                  min={20}
                  max={100}
                  placeholder="e.g. 32"
                  value={age}
                  onChange={(e) => {
                    const val = e.target.value === "" ? "" : parseInt(e.target.value, 10);
                    setAge(val);
                  }}
                  className={`w-full rounded-xl border bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white transition ${
                    age !== "" && (Number(age) < 20 || Number(age) > 100)
                      ? "border-rose-400 bg-rose-50/50"
                      : "border-slate-200 focus:border-slate-400"
                  }`}
                />
              </div>

              {/* DOB */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    DOB *
                  </label>
                  {dobFormatted && (
                    <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                      {dobFormatted}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={dobRaw}
                    onChange={(e) => handleDateChange(e.target.value)}
                    max={new Date(Date.now() - 20 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                    min={new Date(Date.now() - 100 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                  />
                </div>
                <p className="text-[9px] text-slate-400 mt-0.5">Formats as dd-mmm-yyyy</p>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Gender *
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(["M", "F", "Other"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2 rounded-xl text-[11px] font-bold border transition cursor-pointer text-center ${
                        gender === g
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Role & Region */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Operational Role *
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Operational Region *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                  >
                    {REGIONS.map((reg) => (
                      <option key={reg} value={reg}>
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Email Address */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Email Id (Mandatory) *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="operator.name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                />
              </div>
            </div>

            {/* 5. Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Password (min 8 chars) *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer mt-3 shadow-2xs"
            >
              <span>{loading ? "Registering Authorized Profile..." : "Create Account & Enter Console"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Already have an account? Sign In */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Already have an authorized account?{" "}
              <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700 underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
