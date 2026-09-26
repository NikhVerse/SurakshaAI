"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
        if (diffYears >= 18 && diffYears <= 100) {
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
    if (isNaN(numAge) || numAge < 18 || numAge > 100) {
      setError("Age must be between 18 and 100.");
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
    <div className="flex min-h-screen flex-col justify-center bg-slate-50 py-6 sm:py-12 px-3 sm:px-6 lg:px-8 font-sans">
      {/* Header & Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center space-y-1.5 sm:space-y-2">
        <Link href="/" className="inline-block transition hover:opacity-90">
          <Logo size="default" />
        </Link>
        <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900 pt-1">
          Create Account
        </h1>
        <p className="text-xs sm:text-base text-slate-500 font-medium max-w-lg mx-auto">
          Register your credentials to access the safety intelligence console.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="mt-5 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-8 shadow-sm space-y-5 sm:space-y-6">
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 sm:p-4 text-xs sm:text-sm font-semibold text-rose-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Section 1: Personal Details */}
            <div className="space-y-3 sm:space-y-4">
              <div className="border-b border-slate-200 pb-1.5 sm:pb-2 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Personal Details
                </h2>
                <span className="text-xs text-slate-400 font-medium">* Required</span>
              </div>

              {/* Row 1: First, Last, Middle Name */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-1.5 col-span-1">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nikhil"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all"
                  />
                </div>

                <div className="space-y-1.5 col-span-1">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sahu"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                    Middle Name <span className="text-xs text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Kumar"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Age, Gender, DOB */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-1.5 col-span-1">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                    Age <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={18}
                    max={100}
                    placeholder="28"
                    value={age}
                    onChange={(e) => {
                      const val = e.target.value === "" ? "" : parseInt(e.target.value, 10);
                      setAge(val);
                    }}
                    className={`h-11 w-full rounded-xl border bg-slate-50/50 px-3 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                      age !== "" && (Number(age) < 18 || Number(age) > 100)
                        ? "border-rose-400 bg-rose-50/50 focus:border-rose-500"
                        : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                    }`}
                  />
                </div>

                <div className="space-y-1.5 col-span-1">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <div className="h-11 grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
                    {(["M", "F", "Other"] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`h-full rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center ${
                          gender === g
                            ? "bg-slate-900 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                      Date of Birth <span className="text-rose-500">*</span>
                    </label>
                    {dobFormatted && (
                      <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                        {dobFormatted}
                      </span>
                    )}
                  </div>
                  <input
                    type="date"
                    required
                    value={dobRaw}
                    onChange={(e) => handleDateChange(e.target.value)}
                    max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                    min={new Date(Date.now() - 100 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Operational Assignment */}
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Assignment &amp; Location
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">
                    Operational Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all cursor-pointer"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">
                    Operational Region <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all cursor-pointer"
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

            {/* Section 3: Credentials */}
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Account Credentials
                </h2>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="operator.name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 pr-16 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      className="absolute right-3.5 top-3 text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-700">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    {confirmPassword && (
                      <span
                        className={`text-xs font-semibold ${
                          password === confirmPassword ? "text-emerald-600" : "text-rose-500"
                        }`}
                      >
                        {password === confirmPassword ? "Match" : "Mismatch"}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={8}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`h-11 w-full rounded-xl border bg-slate-50/50 px-3.5 pr-16 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                        confirmPassword && password !== confirmPassword
                          ? "border-rose-400 bg-rose-50/40 focus:border-rose-500"
                          : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                      className="absolute right-3.5 top-3 text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
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
