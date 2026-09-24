"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Play,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { fetchApi, TriageTask } from "@/lib/api";
import DetailDrawer, { DrawerData } from "@/components/ui/DetailDrawer";
import { RiskScore, SeverityBadge } from "@/components/ui/StatusSystem";

export default function TriagePage() {
  const [tasks, setTasks] = useState<TriageTask[]>([]);
  const [sortBy, setSortBy] = useState("psif_desc");
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Detail Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null);

  const loadTasks = () => {
    fetchApi<TriageTask[]>(`/api/v1/triage?status_filter=${statusFilter}&sort_by=${sortBy}`)
      .then((data) => setTasks(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
  }, [sortBy, statusFilter]);

  const handleDecision = async (taskId: string, decision: string, reportUid: string) => {
    try {
      await fetchApi(`/api/v1/triage/${taskId}/decision`, {
        method: "POST",
        body: JSON.stringify({
          decision,
          reason: `HSE Triage sign-off: ${decision}`,
          is_training_feedback: true,
        }),
      });
      setTasks((prev) => prev.filter((t) => t.task_id !== taskId));
      setToast(`Incident ${reportUid} confirmed in compliance record.`);
      setTimeout(() => setToast(null), 3500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBatchVerify = async () => {
    const pending = tasks.slice(0, 3);
    for (const t of pending) {
      await fetchApi(`/api/v1/triage/${t.task_id}/decision`, {
        method: "POST",
        body: JSON.stringify({
          decision: "CONFIRMED",
          reason: "Batch verified via Triage Queue Operational Command",
          is_training_feedback: true,
        }),
      }).catch(() => {});
    }
    setToast(`Batch verified ${pending.length} priority incidents.`);
    setTimeout(() => setToast(null), 3500);
    loadTasks();
  };

  const openDrawer = (t: TriageTask) => {
    setDrawerData({
      id: t.task_id,
      uid: t.report_uid,
      title: `${t.activity_name || "Incident"}: ${t.site_name || "Site"}`,
      severity: t.psif_probability >= 0.7 ? "CRITICAL" : "HIGH",
      status: t.status,
      riskScore: t.psif_probability,
      location: t.site_name || "—",
      timestamp: t.date_time ? new Date(t.date_time).toLocaleDateString() : "—",
      narrative: t.narrative_snippet,
      rule: t.primary_lsr || "—",
      primaryBarrier: t.primary_barrier || "—",
      barrierState: t.barrier_state || "—",
      metrics: [
        { label: "pSIF Probability", value: `${(t.psif_probability * 100).toFixed(0)}%` },
        { label: "Priority Score", value: t.priority_score },
        { label: "Confidence", value: `${(t.confidence * 100).toFixed(0)}%` },
      ],
      onConfirm: () => handleDecision(t.task_id, "CONFIRMED", t.report_uid),
      onDismiss: () => handleDecision(t.task_id, "DISMISSED", t.report_uid),
    });
    setDrawerOpen(true);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 font-sans">
      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data={drawerData}
      />

      {/* Toast Notice */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xl animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header — 1-2 words */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              SIF Triage
            </h1>
            <span className="font-mono text-xs font-black px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {tasks.length} Pending
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Operational review queue for human sign-off
          </p>
        </div>

        {tasks.length > 0 && statusFilter === "PENDING" && (
          <button
            onClick={handleBatchVerify}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition shadow-xs cursor-pointer"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Verify Top 3</span>
          </button>
        )}
      </div>

      {/* Filters Toolbar */}
      <div className="flex items-center justify-between gap-3 p-2 rounded-xl border border-slate-200 bg-white shadow-2xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
            Filter:
          </span>
          {["PENDING", "CONFIRMED", "ALL"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === f
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 pr-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
            Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="psif_desc">Highest pSIF</option>
            <option value="date_desc">Latest</option>
          </select>
        </div>
      </div>

      {/* Visual Incident Queue Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white h-36 animate-pulse" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 text-xs font-medium space-y-1">
          <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
          <p className="font-bold text-slate-800 text-sm">Triage Queue Cleared</p>
          <p className="text-slate-400">All high-priority incidents have been reviewed and verified by HSE operations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {tasks.map((t) => {
            const isCritical = t.psif_probability >= 0.7;
            return (
              <div
                key={t.task_id}
                onClick={() => openDrawer(t)}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition cursor-pointer flex flex-col justify-between space-y-3 shadow-2xs group"
              >
                <div className="flex items-center justify-between">
                  <SeverityBadge severity={isCritical ? "CRITICAL" : "HIGH"} />
                  <RiskScore score={t.psif_probability} size="md" />
                </div>

                <div>
                  <span className="font-mono text-xs font-bold text-slate-900 block">
                    {t.report_uid}
                  </span>
                  <span className="font-bold text-sm text-slate-800 block truncate mt-0.5">
                    {t.activity_name || "Hazard Incident"}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-1">
                    <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                    <span className="truncate">{t.site_name || "—"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[11px] font-semibold text-slate-500 font-mono truncate max-w-[170px]">
                    {t.primary_barrier || "—"}
                  </span>

                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-0.5 shrink-0">
                    Review
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
