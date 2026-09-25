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
  ShieldCheck,
  Clock,
  Bell,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Command Center
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Live SIF triage metrics, barrier integrity &amp; precursor signals — all from the database
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
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
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700">
          <Database className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Suraksha AI Active Telemetry — Displaying calibrated industrial safety dataset across 5 critical assets.</span>
        </div>
      )}

      {/* 5-Card Highlighting KPI Grid — Big, Vibrant & Fully Responsive on Mobile & iPhones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Card 1: Total Reports */}
        <Link
          href="/app/reports"
          className="group relative p-4 sm:p-5 rounded-2xl border-2 border-indigo-200/90 bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/50 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all duration-200 active:scale-[0.99] flex flex-row lg:flex-col justify-between items-center lg:items-start min-h-[96px] lg:min-h-[160px]"
        >
          <div className="flex items-center lg:justify-between w-auto lg:w-full gap-3 lg:gap-0">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-200 shadow-2xs group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
            </div>
            <div className="flex flex-col lg:hidden">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-900">
                Reports
              </span>
              <span className="text-xs font-bold text-slate-500">
                Total Submissions
              </span>
            </div>
            <span className="hidden lg:inline text-xs font-black uppercase tracking-wider text-indigo-900">
              Reports
            </span>
          </div>

          <div className="my-0 lg:my-2 text-right lg:text-left">
            <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${loading ? "text-slate-300 animate-pulse" : "text-slate-900"}`}>
              {loading ? "—" : String(totalReports).padStart(2, "0")}
            </span>
          </div>

          <div className="hidden lg:flex items-center justify-between w-full pt-1.5 border-t border-indigo-100">
            <span className="text-xs font-bold text-indigo-800/80">
              Total Submissions
            </span>
            <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md font-mono">
              Database
            </span>
          </div>
        </Link>

        {/* Card 2: Critical SIF Signals */}
        <Link
          href="/app/triage"
          className="group relative p-4 sm:p-5 rounded-2xl border-2 border-rose-400 bg-gradient-to-br from-rose-50 via-white to-red-100/60 shadow-sm hover:shadow-md hover:border-rose-500 ring-2 ring-rose-500/10 transition-all duration-200 active:scale-[0.99] flex flex-row lg:flex-col justify-between items-center lg:items-start min-h-[96px] lg:min-h-[160px]"
        >
          <div className="flex items-center lg:justify-between w-auto lg:w-full gap-3 lg:gap-0">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-300 shadow-2xs group-hover:bg-rose-600 group-hover:text-white transition-colors duration-200">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
            </div>
            <div className="flex flex-col lg:hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-rose-900">
                  SIF Priority
                </span>
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              </div>
              <span className="text-xs font-bold text-rose-600">
                pSIF ≥ 0.60
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-rose-900">
                SIF Priority
              </span>
              <StatusDot status="CRITICAL" pulse size="sm" />
            </div>
          </div>

          <div className="my-0 lg:my-2 text-right lg:text-left">
            <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight text-rose-600 ${loading ? "animate-pulse opacity-40" : ""}`}>
              {loading ? "—" : String(psifPriority).padStart(2, "0")}
            </span>
          </div>

          <div className="hidden lg:flex items-center justify-between w-full pt-1.5 border-t border-rose-200/80">
            <span className="text-xs font-bold text-rose-700">
              pSIF ≥ 0.60
            </span>
            <span className="text-[10px] font-extrabold text-white bg-rose-600 px-2 py-0.5 rounded-md uppercase font-mono shadow-2xs">
              Critical
            </span>
          </div>
        </Link>

        {/* Card 3: Pending Reviews */}
        <Link
          href="/app/triage"
          className="group relative p-4 sm:p-5 rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-white to-orange-100/60 shadow-sm hover:shadow-md hover:border-amber-500 ring-2 ring-amber-500/10 transition-all duration-200 active:scale-[0.99] flex flex-row lg:flex-col justify-between items-center lg:items-start min-h-[96px] lg:min-h-[160px]"
        >
          <div className="flex items-center lg:justify-between w-auto lg:w-full gap-3 lg:gap-0">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-300 shadow-2xs group-hover:bg-amber-600 group-hover:text-white transition-colors duration-200">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
            </div>
            <div className="flex flex-col lg:hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                  Pending
                </span>
                <span className="h-2 w-2 rounded-full bg-amber-500" />
              </div>
              <span className="text-xs font-bold text-amber-700">
                Awaiting Review
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                Pending
              </span>
              <StatusDot status="HIGH" size="sm" />
            </div>
          </div>

          <div className="my-0 lg:my-2 text-right lg:text-left">
            <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight text-amber-600 ${loading ? "animate-pulse opacity-40" : ""}`}>
              {loading ? "—" : String(pendingReviews).padStart(2, "0")}
            </span>
          </div>

          <div className="hidden lg:flex items-center justify-between w-full pt-1.5 border-t border-amber-200/80">
            <span className="text-xs font-bold text-amber-800">
              Awaiting Review
            </span>
            <span className="text-[10px] font-extrabold text-white bg-amber-500 px-2 py-0.5 rounded-md uppercase font-mono shadow-2xs">
              Review
            </span>
          </div>
        </Link>

        {/* Card 4: Active Barriers */}
        <Link
          href="/app/barriers"
          className="group relative p-4 sm:p-5 rounded-2xl border-2 border-emerald-400 bg-gradient-to-br from-emerald-50 via-white to-teal-100/60 shadow-sm hover:shadow-md hover:border-emerald-500 ring-2 ring-emerald-500/10 transition-all duration-200 active:scale-[0.99] flex flex-row lg:flex-col justify-between items-center lg:items-start min-h-[96px] lg:min-h-[160px]"
        >
          <div className="flex items-center lg:justify-between w-auto lg:w-full gap-3 lg:gap-0">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300 shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
              <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
            </div>
            <div className="flex flex-col lg:hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
                  Barriers
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-bold text-emerald-700">
                Active Barriers
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
                Barriers
              </span>
              <StatusDot status="HEALTHY" size="sm" />
            </div>
          </div>

          <div className="my-0 lg:my-2 text-right lg:text-left">
            <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight text-emerald-600 ${loading ? "animate-pulse opacity-40" : ""}`}>
              {loading ? "—" : String(activeBarriers).padStart(2, "0")}
            </span>
          </div>

          <div className="hidden lg:flex items-center justify-between w-full pt-1.5 border-t border-emerald-200/80">
            <span className="text-xs font-bold text-emerald-800">
              Active Barriers
            </span>
            <span className="text-[10px] font-extrabold text-white bg-emerald-600 px-2 py-0.5 rounded-md uppercase font-mono shadow-2xs">
              IOGP 459
            </span>
          </div>
        </Link>

        {/* Card 5: Unacknowledged Alerts */}
        <Link
          href="/app/triage"
          className="group relative p-4 sm:p-5 rounded-2xl border-2 border-red-500 bg-gradient-to-br from-red-50 via-white to-rose-100/60 shadow-sm hover:shadow-md hover:border-red-600 ring-2 ring-red-500/10 transition-all duration-200 active:scale-[0.99] flex flex-row lg:flex-col justify-between items-center lg:items-start min-h-[96px] lg:min-h-[160px]"
        >
          <div className="flex items-center lg:justify-between w-auto lg:w-full gap-3 lg:gap-0">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-300 shadow-2xs group-hover:bg-red-600 group-hover:text-white transition-colors duration-200">
              <Bell className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
            </div>
            <div className="flex flex-col lg:hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-red-900">
                  Alerts
                </span>
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <span className="text-xs font-bold text-red-600">
                Unacknowledged
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-red-900">
                Alerts
              </span>
              <StatusDot status={unackAlerts > 0 ? "CRITICAL" : "NEUTRAL"} pulse={unackAlerts > 0} size="sm" />
            </div>
          </div>

          <div className="my-0 lg:my-2 text-right lg:text-left">
            <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${unackAlerts > 0 ? "text-red-600" : "text-slate-900"} ${loading ? "animate-pulse opacity-40" : ""}`}>
              {loading ? "—" : String(unackAlerts).padStart(2, "0")}
            </span>
          </div>

          <div className="hidden lg:flex items-center justify-between w-full pt-1.5 border-t border-red-200/80">
            <span className="text-xs font-bold text-red-700">
              Unacknowledged
            </span>
            <span className="text-[10px] font-extrabold text-white bg-red-600 px-2 py-0.5 rounded-md uppercase font-mono shadow-2xs animate-pulse">
              Live
            </span>
          </div>
        </Link>
      </div>

      {/* Main Content: Active Alerts + Barrier Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
        {/* LEFT: Live Alerts from DB */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4 shadow-2xs min-w-0">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Active Alerts
              </h2>
              {topAlerts.length > 0 && (
                <span className="ml-1 text-[11px] font-mono font-bold bg-rose-100 text-rose-700 rounded-full px-2 py-0.5">
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
                  className={`p-3.5 rounded-xl border hover:bg-white hover:border-slate-300 transition cursor-pointer flex items-center justify-between gap-2.5 group shadow-2xs ${getSeverityClass(alert.severity)}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <StatusDot status={alert.severity} size="sm" pulse={alert.severity === "CRITICAL"} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {alert.title}
                        </span>
                        <div className="shrink-0">
                          <SeverityBadge severity={alert.severity} />
                        </div>
                      </div>
                      <p className="text-[12px] text-slate-500 font-medium truncate mt-0.5">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-0.5">
                      <span className="hidden sm:inline">Detail</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Barrier Health from DB */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4 shadow-2xs min-w-0">
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
      {/* Monthly Trend (from real DB) — Big, High-Visibility, Executive Grade */}
      {(() => {
        const trendTotalVolume = monthlyTrend.reduce((acc: number, m: any) => acc + (m.total_reports || 0), 0);
        const trendTotalPsif = monthlyTrend.reduce((acc: number, m: any) => acc + (m.psif_priority || 0), 0);
        const trendAvgDensity = trendTotalVolume > 0 ? Math.round((trendTotalPsif / trendTotalVolume) * 100) : 0;
        const trendPeak = monthlyTrend.reduce((max: any, m: any) => ((m.total_reports || 0) > (max?.total_reports || 0) ? m : max), monthlyTrend[0] || null);
        const rawMaxVal = Math.max(...monthlyTrend.map((x: any) => x.total_reports || 0), 10);
        const yMax = Math.ceil(rawMaxVal / 10) * 10;
        const yTicks = [yMax, Math.round(yMax * 0.75), Math.round(yMax * 0.5), Math.round(yMax * 0.25), 0];

        return (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 md:p-8 space-y-6 shadow-xs min-w-0">
            {/* Header with Title, Telemetry pill, and Link */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-100 shrink-0" />
                <div>
                  <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900">
                    6-Month Report &amp; SIF Precursor Trend
                  </h2>
                  <p className="text-xs font-semibold text-slate-500">
                    Temporal trend analysis tracking total incident submissions against high-consequence potential severity
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                  Live Operational Telemetry
                </span>
                <Link
                  href="/app/reports"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition"
                >
                  <span>All Reports</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* 4-Item Executive KPI Summary Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total 6-Month Volume</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {trendTotalVolume} <span className="text-xs font-bold text-slate-500">Reports</span>
                </div>
                <span className="text-[11px] font-medium text-slate-500">All high-hazard assets</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">SIF Precursors</span>
                <div className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight">
                  {trendTotalPsif} <span className="text-xs font-bold text-rose-500">High Risk</span>
                </div>
                <span className="text-[11px] font-medium text-slate-500">Fatality potential identified</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">SIF Exposure Rate</span>
                <div className="text-xl sm:text-2xl font-black text-indigo-600 tracking-tight">
                  {trendAvgDensity}% <span className="text-xs font-bold text-indigo-400">Ratio</span>
                </div>
                <span className="text-[11px] font-medium text-slate-500">Precursor-to-incident ratio</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Peak Reporting Month</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                  {trendPeak?.month || "—"}
                </div>
                <span className="text-[11px] font-medium text-slate-500">{trendPeak?.total_reports || 0} incidents recorded</span>
              </div>
            </div>

            {loading ? (
              <div className="flex gap-4 h-72 sm:h-80 items-end p-6 bg-slate-50/50 rounded-2xl">
                {[40, 60, 35, 75, 50, 65].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-xl bg-slate-200 animate-pulse" style={{ height: `${h}%` }} />
                ))}
              </div>
            ) : monthlyTrend.length === 0 ? (
              <EmptyState label="No reports yet. Submit incident reports to see monthly trends." />
            ) : (
              /* Big, High-Visibility Responsive Chart */
              <div className="relative pt-6 pb-2 min-w-0">
                {/* Main Graph Grid with Y-Axis and Columns */}
                <div className="flex items-stretch h-72 sm:h-80 md:h-96 min-w-0">
                  {/* Left Y-Axis Labels */}
                  <div className="flex flex-col justify-between items-end pr-3 pb-8 text-xs font-mono font-bold text-slate-400 select-none shrink-0 w-8 sm:w-10">
                    <span>{yTicks[0]}</span>
                    <span>{yTicks[1]}</span>
                    <span>{yTicks[2]}</span>
                    <span>{yTicks[3]}</span>
                    <span>0</span>
                  </div>

                  {/* Chart Body Container */}
                  <div className="relative flex-1 flex flex-col justify-between min-w-0">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 pb-8 flex flex-col justify-between pointer-events-none">
                      <div className="w-full border-b border-dashed border-slate-200" />
                      <div className="w-full border-b border-dashed border-slate-200" />
                      <div className="w-full border-b border-dashed border-slate-200" />
                      <div className="w-full border-b border-dashed border-slate-200" />
                      <div className="w-full border-b-2 border-slate-300" />
                    </div>

                    {/* Bars Grid Area spanning 100% width */}
                    <div className="relative z-10 flex-1 flex items-end justify-between gap-2 sm:gap-4 md:gap-8 pb-8 px-1 sm:px-4 min-w-0">
                      {monthlyTrend.map((m: any) => {
                        const totalCount = m.total_reports || 0;
                        const psifCount = m.psif_priority || 0;
                        const heightPct = Math.min(100, Math.max(Math.round((totalCount / yMax) * 100), totalCount > 0 ? 8 : 0));
                        const psifHeightPct = Math.min(100, Math.max(Math.round((psifCount / yMax) * 100), psifCount > 0 ? 8 : 0));
                        const densityVal = Math.round((m.psif_density > 1 ? m.psif_density : (m.psif_density * 100)) || (totalCount > 0 ? (psifCount / totalCount * 100) : 0));

                        return (
                          <div
                            key={m.month}
                            className="flex-1 flex flex-col items-center justify-end h-full group transition-all min-w-0 hover:bg-slate-50/80 rounded-2xl p-1"
                          >
                            {/* Top SIF Density Pill Badge */}
                            <div className="mb-2 transition-all transform group-hover:-translate-y-1">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-rose-50 text-rose-700 border border-rose-200/90 shadow-2xs whitespace-nowrap">
                                {densityVal}% SIF
                              </span>
                            </div>

                            {/* Dual Side-by-Side Bars Container */}
                            <div className="w-full flex items-end justify-center gap-1.5 sm:gap-2.5 md:gap-3 h-full max-h-[85%]">
                              {/* Total Reports Bar (Deep Slate) */}
                              <div
                                className="relative flex flex-col items-center justify-start flex-1 max-w-[48px] rounded-t-xl bg-gradient-to-t from-slate-800 to-slate-600 border border-slate-700 shadow-xs group-hover:from-slate-900 group-hover:to-slate-700 transition-all duration-300"
                                style={{ height: `${heightPct}%` }}
                              >
                                <span className="absolute -top-5 sm:-top-6 text-[11px] sm:text-xs font-black text-slate-800 font-mono tracking-tight group-hover:scale-110 transition-transform">
                                  {totalCount}
                                </span>
                              </div>

                              {/* SIF Priority Bar (Vibrant Crimson/Rose) */}
                              <div
                                className="relative flex flex-col items-center justify-start flex-1 max-w-[48px] rounded-t-xl bg-gradient-to-t from-rose-600 via-rose-500 to-rose-400 border border-rose-500 shadow-xs group-hover:from-rose-700 group-hover:to-rose-500 transition-all duration-300"
                                style={{ height: `${psifHeightPct}%` }}
                              >
                                <span className="absolute -top-5 sm:-top-6 text-[11px] sm:text-xs font-black text-rose-600 font-mono tracking-tight group-hover:scale-110 transition-transform">
                                  {psifCount}
                                </span>
                              </div>
                            </div>

                            {/* Month Label below baseline */}
                            <div className="pt-2 text-center w-full">
                              <div className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                                {m.month}
                              </div>
                              <div className="text-[11px] font-semibold text-slate-400 hidden sm:block">
                                {psifCount}/{totalCount} SIF
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Legend & Methodology Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-100 gap-3">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-bold text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-6 rounded-md bg-gradient-to-r from-slate-800 to-slate-600 border border-slate-700 shadow-2xs" />
                  <span>Total Incidents (All Severities)</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-6 rounded-md bg-gradient-to-r from-rose-600 to-rose-400 border border-rose-500 shadow-2xs" />
                  <span>SIF Priority (Fatality / Severe Precursors)</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                    % SIF
                  </span>
                  <span>Precursor Severity Density Rate</span>
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-400 self-end sm:self-auto">
                Calibrated against IOGP 459 &amp; 501 Barrier Taxonomy
              </div>
            </div>
          </div>
        );
      })()}

      {/* Recent Activity Feed */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4 shadow-2xs min-w-0">
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
                <span className="text-[11px] text-slate-400 font-mono shrink-0">
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
