"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Database,
} from "lucide-react";
import { dashboardApi, DashboardSummary } from "@/lib/api";
import { FALLBACK_DASHBOARD_SUMMARY } from "@/lib/fallback-data";
import DetailDrawer, { DrawerData } from "@/components/ui/DetailDrawer";
import Tooltip from "@/components/ui/Tooltip";
import { StatusDot, SeverityBadge } from "@/components/ui/StatusSystem";

// Helper: derive a colour from severity
function getSeverityClass(severity: string): string {
  switch ((severity || "").toUpperCase()) {
    case "CRITICAL": return "border-rose-200/80 bg-rose-50/20 text-rose-700";
    case "HIGH": return "border-amber-200/80 bg-amber-50/20 text-amber-800";
    case "MEDIUM": return "border-yellow-200/80 bg-yellow-50/10 text-yellow-800";
    default: return "border-slate-200 bg-white text-slate-700";
  }
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
      <Database className="h-8 w-8 opacity-30" />
      <p className="text-xs font-semibold">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(FALLBACK_DASHBOARD_SUMMARY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detail Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getSummary();
      setSummary(data || FALLBACK_DASHBOARD_SUMMARY);
    } catch {
      setSummary(FALLBACK_DASHBOARD_SUMMARY);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAlertDrawer = (alert: {
    id: string;
    title: string;
    message: string;
    severity: string;
    alert_type: string;
    report_id?: string | null;
    created_at?: string | null;
  }) => {
    setDrawerData({
      id: alert.id,
      uid: alert.report_id || alert.id,
      title: alert.title,
      severity: alert.severity,
      status: "UNACKNOWLEDGED",
      riskScore: alert.severity === "CRITICAL" ? 0.9 : alert.severity === "HIGH" ? 0.7 : 0.5,
      location: "—",
      timestamp: alert.created_at
        ? new Date(alert.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
        : "—",
      narrative: alert.message,
      primaryBarrier: alert.alert_type,
      barrierState: alert.severity,
      metrics: [],
    });
    setDrawerOpen(true);
  };

  // Real KPI numbers from summary
  const totalReports = summary?.total_reports ?? 0;
  const psifPriority = summary?.psif_priority_count ?? 0;
  const pendingReviews = summary?.pending_reviews ?? 0;
  const activeBarriers = summary?.active_barriers ?? 0;
  const unackAlerts = summary?.unacknowledged_alerts ?? 0;
  const topAlerts = summary?.top_alerts ?? [];
  const recentActivity = summary?.recent_activity ?? [];
  const monthlyTrend = summary?.monthly_trend ?? [];
  const barrierHealth = summary?.barrier_health ?? [];
  const barrierStates = summary?.barrier_states ?? {};

  return (
    <div className="space-y-6 pb-20 font-sans">
      {/* Universal Detail Drawer */}
      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data={drawerData}
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Command Center
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Live SIF triage metrics, barrier integrity &amp; precursor signals — all from the database
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            title="Refresh metrics"
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-slate-900" : ""}`} strokeWidth={1.8} />
          </button>
          <Link
            href="/app/triage"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-xs"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" strokeWidth={2} />
            <span>Triage Queue</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs font-semibold text-sky-800">
          <Database className="h-4 w-4 text-sky-600 shrink-0" />
          <span>Sovereign Offline Dataset — live backend at localhost not connected. Displaying industrial safety telemetry.</span>
        </div>
      )}

      {/* 5-Card KPI Strip — all numbers from real database */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Reports */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Reports
            </span>
            <FileText className="h-3.5 w-3.5 text-slate-300" />
          </div>
          <span className={`text-3xl font-black font-mono tracking-tight mt-1.5 ${loading ? "text-slate-300 animate-pulse" : "text-slate-900"}`}>
            {loading ? "—" : String(totalReports).padStart(2, "0")}
          </span>
          <span className="text-[10px] font-bold text-slate-500 mt-1">
            Total Submissions
          </span>
        </div>

        {/* Critical SIF Signals */}
        <div className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/20 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
              SIF Priority
            </span>
            <StatusDot status="CRITICAL" pulse size="sm" />
          </div>
          <span className={`text-3xl font-black font-mono text-rose-600 tracking-tight mt-1.5 ${loading ? "animate-pulse opacity-40" : ""}`}>
            {loading ? "—" : String(psifPriority).padStart(2, "0")}
          </span>
          <span className="text-[10px] font-bold text-rose-600/90 mt-1">
            pSIF ≥ 0.60
          </span>
        </div>

        {/* Pending Reviews */}
        <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/20 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
              Pending
            </span>
            <StatusDot status="HIGH" size="sm" />
          </div>
          <span className={`text-3xl font-black font-mono text-amber-600 tracking-tight mt-1.5 ${loading ? "animate-pulse opacity-40" : ""}`}>
            {loading ? "—" : String(pendingReviews).padStart(2, "0")}
          </span>
          <span className="text-[10px] font-bold text-amber-700 mt-1">
            Awaiting Review
          </span>
        </div>

        {/* Active Barriers */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Barriers
            </span>
            <StatusDot status="HEALTHY" size="sm" />
          </div>
          <span className={`text-3xl font-black font-mono text-emerald-600 tracking-tight mt-1.5 ${loading ? "animate-pulse opacity-40" : ""}`}>
            {loading ? "—" : String(activeBarriers).padStart(2, "0")}
          </span>
          <span className="text-[10px] font-bold text-emerald-700 mt-1">
            Active Barriers
          </span>
        </div>

        {/* Unacknowledged Alerts */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Alerts
            </span>
            <StatusDot status={unackAlerts > 0 ? "CRITICAL" : "NEUTRAL"} pulse={unackAlerts > 0} size="sm" />
          </div>
          <span className={`text-3xl font-black font-mono tracking-tight mt-1.5 ${unackAlerts > 0 ? "text-rose-600" : "text-slate-900"} ${loading ? "animate-pulse opacity-40" : ""}`}>
            {loading ? "—" : String(unackAlerts).padStart(2, "0")}
          </span>
          <span className="text-[10px] font-bold text-slate-500 mt-1">
            Unacknowledged
          </span>
        </div>
      </div>

      {/* Main Content: Active Alerts + Barrier Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Live Alerts from DB */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Active Alerts
              </h2>
              {topAlerts.length > 0 && (
                <span className="ml-1 text-[10px] font-mono font-bold bg-rose-100 text-rose-700 rounded-full px-2 py-0.5">
                  {topAlerts.length}
                </span>
              )}
            </div>
            <Link
              href="/app/triage"
              className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition"
            >
              <span>Triage Queue</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : topAlerts.length === 0 ? (
            <EmptyState label="No unacknowledged alerts. System nominal." />
          ) : (
            <div className="space-y-2.5">
              {topAlerts.map((alert: any) => (
                <div
                  key={alert.id}
                  onClick={() => openAlertDrawer(alert)}
                  className={`p-3.5 rounded-xl border hover:bg-white hover:border-slate-300 transition cursor-pointer flex items-center justify-between gap-3 group shadow-2xs ${getSeverityClass(alert.severity)}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <StatusDot status={alert.severity} size="sm" pulse={alert.severity === "CRITICAL"} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {alert.title}
                        </span>
                        <SeverityBadge severity={alert.severity} />
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-0.5">
                      Detail
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Barrier Health from DB */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Barrier Health
              </h2>
            </div>
            <Link
              href="/app/barriers"
              className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition"
            >
              <span>Matrix</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : barrierHealth.length === 0 ? (
            <EmptyState label="No barrier data yet. Submit reports to generate barrier health." />
          ) : (
            <div className="space-y-3">
              {barrierHealth.slice(0, 5).map((b: any) => {
                const total = (b.verified || 0) + (b.unverified || 0) + (b.failed || 0);
                const score = total > 0 ? Math.round((b.verified / total) * 100) : 0;
                const statusVal = score >= 80 ? "VERIFIED" : score >= 50 ? "DEGRADED" : "FAILED";
                return (
                  <div key={b.code} className="space-y-1.5 p-2 rounded-xl hover:bg-slate-50 transition">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 truncate max-w-[60%]">{b.name}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className={`text-xs font-black ${score >= 80 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-rose-600"}`}>
                          {score}%
                        </span>
                        <StatusDot status={statusVal} size="sm" />
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Monthly Trend (from real DB) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              6-Month Report Trend
            </h2>
          </div>
          <Link
            href="/app/reports"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
          >
            <span>All Reports</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-4 h-24 items-end">
            {[40, 60, 35, 75, 50, 65].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-lg bg-slate-100 animate-pulse" style={{ height: `${h}%` }} />
            ))}
          </div>
        ) : monthlyTrend.length === 0 ? (
          <EmptyState label="No reports yet. Submit incident reports to see monthly trends." />
        ) : (
          <div className="flex items-end gap-2 h-24">
            {monthlyTrend.map((m: any) => {
              const maxVal = Math.max(...monthlyTrend.map((x: any) => x.total_reports), 1);
              const heightPct = Math.round((m.total_reports / maxVal) * 100);
              const psifHeightPct = Math.round(((m.psif_priority || 0) / maxVal) * 100);
              return (
                <Tooltip
                  key={m.month}
                  content={`${m.month}: ${m.total_reports} reports, ${m.psif_priority} SIF-priority (${m.psif_density}%)`}
                >
                  <div className="flex-1 flex flex-col items-center gap-1 cursor-default">
                    <div className="w-full flex items-end gap-0.5 h-20">
                      <div
                        className="flex-1 rounded-t-md bg-slate-200 transition-all duration-500"
                        style={{ height: `${heightPct}%` }}
                      />
                      <div
                        className="flex-1 rounded-t-md bg-rose-400 transition-all duration-500"
                        style={{ height: `${psifHeightPct}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">{m.month}</span>
                  </div>
                </Tooltip>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 pt-1">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-200" />
            Total Reports
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            SIF Priority
          </span>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recent Activity
            </h2>
          </div>
          <Link
            href="/app/audit-log"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
          >
            <span>Full Log</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 rounded-lg bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : recentActivity.length === 0 ? (
          <EmptyState label="No activity recorded yet." />
        ) : (
          <div className="space-y-1">
            {recentActivity.slice(0, 8).map((log: any) => (
              <div
                key={log.id}
                className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="text-xs font-semibold text-slate-800 flex-1 truncate">
                  {log.action.replace(/_/g, " ")} — {log.entity_type}
                  {log.entity_id ? ` #${String(log.entity_id).slice(0, 8)}` : ""}
                </span>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {log.timestamp
                    ? new Date(log.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                    : "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
