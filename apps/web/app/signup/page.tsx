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
  CalendarDays,
  MapPin,
  CheckCircle2,
  Sparkles,
  Hash,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
  BadgeCheck,
  ChevronDown,
  ShieldCheck,
  Check,
  Sparkle,
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
  const [dobRaw, setDobRaw] = useState("");
  const [dobFormatted, setDobFormatted] = useState("");
  const [gender, setGender] = useState<"M" | "F" | "Other">("M");
  const [role, setRole] = useState("HSE_ANALYST");
  const [region, setRegion] = useState(REGIONS[0]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      setError("Date of Birth (DOB) is mandatory.");
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
    <div className="flex min-h-screen flex-col justify-center bg-linear-to-b from-slate-50 via-slate-100/50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Header & Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-block transition hover:opacity-90">
          <Logo size="default" />
        </Link>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[10px] font-bold text-blue-700 tracking-wider uppercase mt-1">
          <ShieldCheck className="h-3 w-3 text-blue-600" />
          <span>Sovereign Risk Intelligence Platform</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 pt-1">
          Create Operator Account
        </h1>
        <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
          Register credentials to access the critical-risk evaluation &amp; precursor intelligence console.
        </p>
      </div>

      {/* Main Slim Form Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-sm p-6 sm:p-7 shadow-xl shadow-slate-200/50 space-y-5">
          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs font-semibold text-rose-800 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ---------------- 01. Legal Identity ---------------- */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  01 // Legal Identity
                </span>
                <span className="text-[10px] text-slate-400 font-medium">* Required</span>
              </div>

              {/* 1. First Name */}
              <div className="space-y-1">
                <label className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <User className="h-3 w-3 text-slate-400" />
                    First Name
                    <span className="text-rose-500">*</span>
                  </span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nikhil"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all"
                  />
                </div>
              </div>

              {/* 2. Middle Name (Optional) */}
              <div className="space-y-1">
                <label className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <BadgeCheck className="h-3 w-3 text-slate-400" />
                    Middle Name
                    <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                  </span>
                </label>
                <div className="relative">
                  <BadgeCheck className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. Kumar"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all"
                  />
                </div>
              </div>

              {/* 3. Last Name */}
              <div className="space-y-1">
                <label className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="h-3 w-3 text-slate-400" />
                    Last Name
                    <span className="text-rose-500">*</span>
                  </span>
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sahu"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* ---------------- 02. Operator Attributes ---------------- */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  02 // Operator Attributes
                </span>
              </div>

              {/* 4. Age */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <Hash className="h-3 w-3 text-slate-400" />
                    Age (20 – 100 yrs)
                    <span className="text-rose-500">*</span>
                  </label>
                  {age !== "" && Number(age) >= 20 && Number(age) <= 100 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                      <Check className="h-3 w-3" /> Validated
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="number"
                    required
                    min={20}
                    max={100}
                    placeholder="Enter operator age (e.g. 28)"
                    value={age}
                    onChange={(e) => {
                      const val = e.target.value === "" ? "" : parseInt(e.target.value, 10);
                      setAge(val);
                    }}
                    className={`h-10 w-full rounded-xl border bg-slate-50/70 pl-9 pr-3 text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:bg-white transition-all ${
                      age !== "" && (Number(age) < 20 || Number(age) > 100)
                        ? "border-rose-400 bg-rose-50/50 focus:border-rose-500"
                        : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                    }`}
                  />
                </div>
              </div>

              {/* 5. Date of Birth */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <CalendarDays className="h-3 w-3 text-slate-400" />
                    Date of Birth
                    <span className="text-rose-500">*</span>
                  </label>
                  {dobFormatted && (
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      {dobFormatted}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={dobRaw}
                    onChange={(e) => handleDateChange(e.target.value)}
                    max={new Date(Date.now() - 20 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                    min={new Date(Date.now() - 100 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Formats automatically as dd-mmm-yyyy</p>
              </div>

              {/* 6. Gender */}
              <div className="space-y-1">
                <label className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-slate-400" />
                    Gender
                    <span className="text-rose-500">*</span>
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100/90 border border-slate-200/80">
                  {(["M", "F", "Other"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`h-8 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        gender === g
                          ? "bg-slate-900 text-white shadow-xs scale-[1.01]"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                      }`}
                    >
                      <span>{g}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ---------------- 03. Operations & Role ---------------- */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  03 // Operations &amp; Jurisdiction
                </span>
              </div>

              {/* 7. Operational Role */}
              <div className="space-y-1">
                <label className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Shield className="h-3 w-3 text-slate-400" />
                    Operational Role
                    <span className="text-rose-500">*</span>
                  </span>
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-8 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all cursor-pointer"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 8. Operational Region */}
              <div className="space-y-1">
                <label className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    Operational Region
                    <span className="text-rose-500">*</span>
                  </span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-8 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all cursor-pointer"
                  >
                    {REGIONS.map((reg) => (
                      <option key={reg} value={reg}>
                        {reg}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* ---------------- 04. Authentication Credentials ---------------- */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                  04 // Credentials
                </span>
              </div>

              {/* 9. Email Address */}
              <div className="space-y-1">
                <label className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-slate-400" />
                    Email Id (Mandatory)
                    <span className="text-rose-500">*</span>
                  </span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="operator.name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all"
                  />
                </div>
              </div>

              {/* 10. Password */}
              <div className="space-y-1">
                <label className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-3 w-3 text-slate-400" />
                    Password (min 8 chars)
                    <span className="text-rose-500">*</span>
                  </span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="Create a strong security password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-10 text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer transition"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* 11. Confirm Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <KeyRound className="h-3 w-3 text-slate-400" />
                    Confirm Password
                    <span className="text-rose-500">*</span>
                  </label>
                  {confirmPassword && (
                    <span className="text-[10px] font-bold">
                      {password === confirmPassword ? (
                        <span className="text-emerald-600 inline-flex items-center gap-0.5">
                          <Check className="h-3 w-3" /> Match
                        </span>
                      ) : (
                        <span className="text-rose-500">Does not match</span>
                      )}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="Re-enter password to verify"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`h-10 w-full rounded-xl border bg-slate-50/70 pl-9 pr-10 text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:bg-white transition-all ${
                      confirmPassword && password !== confirmPassword
                        ? "border-rose-400 bg-rose-50/50 focus:border-rose-500"
                        : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer transition"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 px-4 shadow-lg shadow-slate-900/15 hover:shadow-slate-900/25 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>{loading ? "Authorizing Operator Credentials..." : "Create Account & Enter Console"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Already have an authorized account?{" "}
              <Link href="/login" className="font-bold text-slate-900 hover:text-blue-600 underline underline-offset-4">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
