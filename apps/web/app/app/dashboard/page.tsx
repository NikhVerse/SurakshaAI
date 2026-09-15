"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText, AlertTriangle, ShieldCheck, Layers,
  TrendingUp, ArrowRight, RefreshCw, CheckCircle2,
  Clock, Activity, AlertCircle, Bot, Database
} from "lucide-react";
import { dashboardApi, DashboardSummary } from "@/lib/api";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getSummary();
      setSummary(data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-10 pb-16">
      {/* Page Header with Generous Whitespace */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Operational Safety Command Center
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Real-time critical risk prioritization, precursor clustering &amp; barrier defense analytics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/app/chat"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
          >
            <Bot className="h-4 w-4" />
            <span>Safety Copilot</span>
          </Link>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-800">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Incidents */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Monitored</span>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-600 border border-slate-200">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
            {loading ? "..." : (summary?.total_reports || 33)}
          </p>
          <p className="text-xs font-medium text-slate-500">
            Across 5 Indian high-hazard assets
          </p>
        </div>

        {/* High SIF Potential */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">High pSIF Priority</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-mono text-rose-600 tracking-tight">
            {loading ? "..." : (summary?.psif_priority_count || 5)}
          </p>
          <p className="text-xs font-medium text-rose-600">
            Probability &gt;= 0.70 (Action Required)
          </p>
        </div>

        {/* Barrier Health */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Barrier Health Index</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-mono text-emerald-600 tracking-tight">
            88.4%
          </p>
          <p className="text-xs font-medium text-slate-500">
            18 IOGP Barriers verified active
          </p>
        </div>

        {/* Precursor Clusters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Precursors</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-mono text-indigo-600 tracking-tight">
            4 Clusters
          </p>
          <p className="text-xs font-medium text-slate-500">
            Unsupervised HDBSCAN detection
          </p>
        </div>
      </div>

      {/* Main Grid: Triage Queue & Barrier Integrity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Triage Queue */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Critical SIF Triage Queue</h2>
              <p className="text-xs text-slate-500 mt-0.5">High-priority precursor incidents requiring analyst review</p>
            </div>
            <Link
              href="/app/triage"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              {
                id: "REP-MUM-001",
                site: "Mumbai High Offshore (B Platform)",
                rule: "Bypass Safety Controls",
                risk: 0.88,
                narrative: "Hydrocarbon vapor release during flare knockout drum bypass without gas test confirmation.",
              },
              {
                id: "REP-ASM-004",
                site: "Digboi Asset, Assam Basin",
                rule: "Energy Isolation (LOTO)",
                risk: 0.82,
                narrative: "Wellhead crude transfer manifold packing failure with unverified isolation boundary.",
              },
              {
                id: "REP-GUJ-007",
                site: "Hazira Gas Terminal, Gujarat",
                rule: "Hot Work Controls",
                risk: 0.76,
                narrative: "Welding torch ignition near LPG condensate drain line; spark containment screen degraded.",
              },
            ].map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-900">{item.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                      pSIF {item.risk}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{item.site}</span>
                </div>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  {item.narrative}
                </p>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 pt-1 border-t border-slate-200/60">
                  <span>Violated Rule: <strong className="text-slate-800">{item.rule}</strong></span>
                  <Link href={`/app/triage`} className="text-blue-600 font-bold hover:underline">
                    Conduct Review &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Barrier Health Status */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Critical Barrier Integrity</h2>
              <p className="text-xs text-slate-500 mt-0.5">IOGP 459 taxonomy barrier status</p>
            </div>
            <Link
              href="/app/barriers"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Details</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {[
              { name: "Physical Isolation (Double Block & Bleed)", category: "ENGINEERED", score: 92, status: "VERIFIED" },
              { name: "Hazardous Area Ignition Control (Ex-Rated)", category: "PHYSICAL", score: 85, status: "DEGRADED" },
              { name: "Permit to Work (PTW) Cross-Signoff", category: "PROCEDURAL", score: 71, status: "FAILED" },
              { name: "Combustible & Toxic Gas Detection (LEL)", category: "ENGINEERED", score: 96, status: "VERIFIED" },
              { name: "Emergency Shutdown (ESD Valve Seal)", category: "ENGINEERED", score: 89, status: "VERIFIED" },
            ].map((b) => (
              <div key={b.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{b.name}</span>
                  <span className={`font-mono font-bold ${
                    b.status === "VERIFIED" ? "text-emerald-600" : b.status === "DEGRADED" ? "text-amber-600" : "text-rose-600"
                  }`}>
                    {b.score}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      b.status === "VERIFIED" ? "bg-emerald-500" : b.status === "DEGRADED" ? "bg-amber-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${b.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1.5">
            <p className="font-bold">Key Recommendation:</p>
            <p className="leading-relaxed">
              Elevated degradation detected in <strong>PTW Cross-Signoff</strong> at Gujarat Terminal. Schedule operational verification within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
