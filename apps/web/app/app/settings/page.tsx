"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Shield,
  CheckCircle2,
  Users,
  Edit3,
  X,
  Phone,
  Mail,
  Server,
  Database,
  Cpu,
  Clock,
  UserCheck,
  UserX,
} from "lucide-react";
import { usersApi, systemApi, UserItem } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { StatusDot } from "@/components/ui/StatusSystem";

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

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [toast, setToast] = useState<string | null>(null);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editMiddleName, setEditMiddleName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editAge, setEditAge] = useState<number | "">("");
  const [editDob, setEditDob] = useState("");
  const [editGender, setEditGender] = useState<"M" | "F" | "Other">("M");
  const [editRole, setEditRole] = useState("HSE_ANALYST");
  const [editRegion, setEditRegion] = useState(REGIONS[0]);
  const [editPhone, setEditPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // User Management State (Admin)
  const [userList, setUserList] = useState<UserItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // System Health
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [loadingHealth, setLoadingHealth] = useState(true);

  const syncFormFromUser = () => {
    if (!user) return;
    const nameParts = (user.full_name || "").split(" ");
    setEditFirstName(user.first_name || nameParts[0] || "");
    setEditMiddleName(user.middle_name || (nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : ""));
    setEditLastName(user.last_name || (nameParts.length > 1 ? nameParts[nameParts.length - 1] : "") || "");
    setEditAge(user.age || "");
    setEditDob(user.dob || "");
    const gUpper = (user.gender || "M").trim().toUpperCase();
    const normalized: "M" | "F" | "Other" = (gUpper === "F" || gUpper === "FEMALE") ? "F" : (gUpper === "M" || gUpper === "MALE") ? "M" : "Other";
    setEditGender(normalized);
    setEditRole(user.role || "HSE_ANALYST");
    setEditRegion(user.region || REGIONS[0]);
    setEditPhone(user.phone || "");
  };

  useEffect(() => {
    syncFormFromUser();
  }, [user]);

  const loadUsers = () => {
    if (user?.role === "ADMINISTRATOR" || user?.role === "SUPER_ADMIN") {
      setLoadingUsers(true);
      usersApi
        .listUsers()
        .then(setUserList)
        .catch(console.error)
        .finally(() => setLoadingUsers(false));
    }
  };

  useEffect(() => {
    loadUsers();
  }, [user?.role]);

  useEffect(() => {
    systemApi
      .getHealth()
      .then(setSystemHealth)
      .catch(console.error)
      .finally(() => setLoadingHealth(false));
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await usersApi.updateUserRole(userId, newRole);
      setToast(`User role updated to ${newRole}`);
      loadUsers();
      setTimeout(() => setToast(null), 3500);
    } catch (err: any) {
      setToast(err.message || "Failed to update role");
      setTimeout(() => setToast(null), 3500);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await usersApi.updateUserRole(userId, undefined, newStatus);
      setToast(`Account status set to ${newStatus}`);
      loadUsers();
      setTimeout(() => setToast(null), 3500);
    } catch (err: any) {
      setToast(err.message || "Failed to update status");
      setTimeout(() => setToast(null), 3500);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFirstName.trim() || !editLastName.trim()) {
      setToast("First Name and Last Name are mandatory.");
      setTimeout(() => setToast(null), 3500);
      return;
    }
    const numAge = Number(editAge);
    if (editAge !== "" && (isNaN(numAge) || numAge < 20 || numAge > 100)) {
      setToast("Age must be between 20 and 100.");
      setTimeout(() => setToast(null), 3500);
      return;
    }

    setSavingProfile(true);
    try {
      await updateProfile({
        first_name: editFirstName.trim(),
        middle_name: editMiddleName.trim() || undefined,
        last_name: editLastName.trim(),
        age: numAge || undefined,
        dob: editDob.trim() || undefined,
        gender: editGender,
        role: editRole,
        region: editRegion,
        phone: editPhone.trim() || undefined,
      });
      setIsEditingProfile(false);
      setToast("Profile details updated successfully.");
      setTimeout(() => setToast(null), 3500);
    } catch (err: any) {
      setToast(err.message || "Failed to update profile.");
      setTimeout(() => setToast(null), 3500);
    } finally {
      setSavingProfile(false);
    }
  };

  const roleLabel = (r?: string) => {
    const match = ROLES.find((item) => item.value === r);
    return match ? match.label : r ? r.replace(/_/g, " ") : "—";
  };

  const initials = (user?.full_name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-8 max-w-4xl pb-20 font-sans">
      {/* Toast Notice */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
          Account &amp; System Configuration
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Operator identity profile, administrative user controls, and sovereign system telemetry
        </p>
      </div>

      {/* Section 1: Operator Profile */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <User className="h-4 w-4 text-slate-700" strokeWidth={1.8} />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Active Operator Profile
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              if (isEditingProfile) {
                syncFormFromUser();
                setIsEditingProfile(false);
              } else {
                syncFormFromUser();
                setIsEditingProfile(true);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            {isEditingProfile ? (
              <>
                <X className="h-3.5 w-3.5 text-slate-500" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            {/* Name Fields */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Full Legal Name
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="First Name *"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Middle Name (Optional)"
                    value={editMiddleName}
                    onChange={(e) => setEditMiddleName(e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Last Name *"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Age, DOB, Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Age (20 – 100)
                </label>
                <input
                  type="number"
                  min={20}
                  max={100}
                  placeholder="e.g. 34"
                  value={editAge}
                  onChange={(e) => {
                    const v = e.target.value === "" ? "" : parseInt(e.target.value, 10);
                    setEditAge(v);
                  }}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Date of Birth (dd-mmm-yyyy)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15-Aug-1992"
                  value={editDob}
                  onChange={(e) => setEditDob(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(["M", "F", "Other"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setEditGender(g)}
                      className={`py-2 rounded-xl text-[11px] font-bold border transition cursor-pointer text-center ${
                        editGender === g
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

            {/* Role & Region */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Operational Role
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Operational Region
                </label>
                <select
                  value={editRegion}
                  onChange={(e) => setEditRegion(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400"
                >
                  {REGIONS.map((reg) => (
                    <option key={reg} value={reg}>
                      {reg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  syncFormFromUser();
                  setIsEditingProfile(false);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white font-bold text-xs text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingProfile}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 disabled:opacity-50 transition cursor-pointer"
              >
                {savingProfile ? "Saving Profile..." : "Save Profile Details"}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white font-black text-lg shrink-0">
                {initials}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Name</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{user?.full_name || "—"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Email Address</span>
                  <p className="text-sm font-mono font-medium text-slate-700 mt-0.5">{user?.email || "—"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Assigned Role</span>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200">
                    {roleLabel(user?.role)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Region</span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5 truncate" title={user?.region || "—"}>
                  {user?.region || "—"}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Age / Gender</span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">
                  {user?.age ? `${user.age} yrs` : "—"} &bull; {user?.gender || "—"}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Date of Birth</span>
                <p className="text-xs font-mono font-semibold text-slate-800 mt-0.5">
                  {user?.dob || "—"}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Phone</span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">
                  {user?.phone || "—"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: User Administration (Admin Only) */}
      {(user?.role === "ADMINISTRATOR" || user?.role === "SUPER_ADMIN") && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Users className="h-4 w-4 text-slate-700" strokeWidth={1.8} />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                User Management ({userList.length})
              </h2>
            </div>
          </div>

          {loadingUsers ? (
            <div className="py-6 text-center text-xs text-slate-400">Loading user accounts...</div>
          ) : userList.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">No other users registered.</div>
          ) : (
            <div className="divide-y divide-slate-100 overflow-x-auto">
              {userList.map((u) => (
                <div key={u.id} className="py-3 flex items-center justify-between gap-4 min-w-[500px]">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center">
                      {(u.full_name || u.email).slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{u.full_name}</p>
                      <p className="text-[11px] font-mono text-slate-500">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none"
                    >
                      <option value="HSE_ANALYST">HSE Analyst</option>
                      <option value="HSE_MANAGER">HSE Manager</option>
                      <option value="ADMINISTRATOR">Administrator</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleStatusToggle(u.id, u.account_status)}
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition ${
                        u.account_status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {u.account_status}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Section 3: Sovereign System & Infrastructure Diagnostics */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Server className="h-4 w-4 text-slate-700" strokeWidth={1.8} />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Sovereign Infrastructure Diagnostics
            </h2>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <StatusDot status="HEALTHY" size="sm" />
            <span>Air-Gapped Sovereign</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Database className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Database Engine</span>
            </div>
            <p className="text-xs font-bold text-slate-900 font-mono">
              SQLite / PostgreSQL Core
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold block">
              {systemHealth?.database === "connected" ? "Connected & Indexed" : "Active Local Instance"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Cpu className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Vector Index</span>
            </div>
            <p className="text-xs font-bold text-slate-900 font-mono">
              In-Process Hybrid Index
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold block">
              BM25 + Semantic Embeddings
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Uptime</span>
            </div>
            <p className="text-xs font-bold text-slate-900 font-mono">
              {systemHealth?.uptime_seconds ? `${Math.round(systemHealth.uptime_seconds)}s` : "Online"}
            </p>
            <span className="text-[10px] text-slate-500 font-semibold block">
              Version {systemHealth?.app_version || "1.0.0"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
