"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity as ActivityIcon,
  ArrowRight,
  ShieldAlert,
  Flame,
  Wrench,
  Zap,
  HardHat,
  Search,
} from "lucide-react";
import { fetchApi } from "@/lib/api";
import { DetailDrawer } from "@/components/ui/DetailDrawer";
import { Tooltip } from "@/components/ui/Tooltip";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);

  useEffect(() => {
    fetchApi<any[]>("/api/v1/activities")
      .then((data) => setActivities(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalReports = activities.reduce((acc, a) => acc + (a.total_reports || 0), 0);

  const getActivityIcon = (cat: string, name: string) => {
    const s = `${cat} ${name}`.toLowerCase();
    if (s.includes("hot") || s.includes("weld")) return Flame;
    if (s.includes("electric") || s.includes("power")) return Zap;
    if (s.includes("maint") || s.includes("repair")) return Wrench;
    if (s.includes("isolat") || s.includes("confine")) return ShieldAlert;
    return HardHat;
  };

  const filtered = activities.filter((a) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.code.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Top Operational Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <ActivityIcon className="h-5 w-5 text-slate-800" strokeWidth={1.8} />
            <span>Work Profiles</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Hazard exposure and incident density segmented by industrial work types &amp; permits
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 w-full sm:w-64 shadow-2xs">
          <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search activity code or name..."
            className="w-full bg-transparent focus:outline-none text-slate-900 font-medium"
          />
        </div>
      </div>

      {/* Number-First Operational KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Profiles</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">0{activities.length}</p>
          <span className="text-[10px] font-semibold text-slate-500">IOGP Categories</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Records</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">{totalReports}</p>
          <span className="text-[10px] font-semibold text-slate-500">Associated Events</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">High Density</span>
          <p className="text-2xl font-black text-rose-600 font-mono mt-0.5">
            0{activities.filter((a) => (a.total_reports || 0) > 5).length}
          </p>
          <span className="text-[10px] font-semibold text-rose-700">Precursor Critical</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Permit Standard</span>
          <p className="text-lg font-black text-slate-900 font-mono mt-1">OISD-105</p>
          <span className="text-[10px] font-semibold text-slate-500">Work Authorization</span>
        </div>
      </div>

      {/* Visual Activity Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 h-36 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => {
            const Icon = getActivityIcon(a.category, a.name);
            const isHighDensity = (a.total_reports || 0) > 5;

            return (
              <div
                key={a.id}
                onClick={() => setSelectedActivity(a)}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 hover:shadow-xs transition cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-700">
                        {a.code}
                      </span>
                      <span className="rounded-md bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 text-[10px] font-bold uppercase">
                        {a.category}
                      </span>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <h2 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                    {a.name}
                  </h2>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Records</span>
                    <span className={`text-base font-black font-mono ${isHighDensity ? "text-rose-600" : "text-slate-900"}`}>
                      {a.total_reports}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700 group-hover:text-slate-900 transition">
                    <span>Inspect</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Universal Detail Drawer */}
      <DetailDrawer
        isOpen={Boolean(selectedActivity)}
        onClose={() => setSelectedActivity(null)}
        title={selectedActivity?.name || "Activity Details"}
        subtitle={`${selectedActivity?.code} • ${selectedActivity?.category}`}
        status={{
          label: (selectedActivity?.total_reports || 0) > 5 ? "HIGH EXPOSURE" : "CONTROLLED",
          variant: (selectedActivity?.total_reports || 0) > 5 ? "critical" : "healthy",
        }}
        metrics={[
          { label: "Associated Events", value: selectedActivity?.total_reports || 0 },
          { label: "Code", value: selectedActivity?.code || "—" },
          { label: "Permit Class", value: "PTW Level 2" },
          { label: "Isolation", value: "Mandatory" },
        ]}
        tabs={[
          {
            id: "overview",
            label: "Overview",
            content: (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Operational Scope
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Governed under IOGP Life-Saving Rules and mandatory positive isolation protocols.
                    All personnel entering this task category require valid Permit to Work sign-offs and continuous gas sniff checks.
                  </p>
                </div>

                <div className="space-y-2">
                  <Link
                    href={`/app/reports?activity=${selectedActivity?.id}`}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition text-xs font-bold text-slate-900"
                  >
                    <span>View Linked Incident Reports ({selectedActivity?.total_reports})</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
