"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  AlertTriangle,
  ShieldCheck,
  Layers,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Plus,
  MapPin,
  ShieldAlert,
  ArrowUpRight,
  XCircle,
  Clock,
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
    <div className="space-y-8 pb-16 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Safety Command Center
          </h1>
          <p className="text-base text-slate-500 font-medium mt-1">
            Critical risk prioritization, precursor clustering &amp; barrier defense analytics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            title="Refresh live metrics"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-slate-900" : "text-slate-500"}`} strokeWidth={1.8} />
            <span className="hidden sm:inline">Sync</span>
          </button>
          <Link
            href="/app/triage"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition shadow-xs"
          >
            <AlertTriangle className="h-4 w-4 text-amber-400" strokeWidth={1.8} />
            <span>Triage Priority</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-800">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" strokeWidth={1.8} />
          <span>{error}</span>
        </div>
      )}

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Monitored */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3.5 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Monitored</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <FileText className="h-4 w-4" strokeWidth={1.8} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 tracking-tight">
              {loading ? "..." : (summary?.total_reports || 33)}
            </p>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              5 Assets
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Clock className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.8} />
            <span>Active monitoring cycle</span>
          </div>
        </div>

        {/* High pSIF Priority */}
        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/20 p-6 space-y-3.5 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">High pSIF Priority</span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <AlertTriangle className="h-4 w-4" strokeWidth={1.8} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl sm:text-4xl font-extrabold font-mono text-rose-600 tracking-tight">
              {loading ? "..." : (summary?.psif_priority_count || 5)}
            </p>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              ≥ 0.70 pSIF
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
            <AlertCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
            <span>Requires operational triage</span>
          </div>
        </div>

        {/* Barrier Health */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3.5 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Barrier Integrity</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-4 w-4" strokeWidth={1.8} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600 tracking-tight">
              88.4%
            </p>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              IOGP 459
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" strokeWidth={1.8} />
            <span>18 verified critical barriers</span>
          </div>
        </div>

        {/* Precursor Clusters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3.5 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Precursors</span>
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Layers className="h-4 w-4" strokeWidth={1.8} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl sm:text-4xl font-extrabold font-mono text-indigo-600 tracking-tight">
              4 Clusters
            </p>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              HDBSCAN
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Layers className="h-3.5 w-3.5 text-indigo-600" strokeWidth={1.8} />
            <span>Multi-site pattern linkage</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Triage Queue & Barrier Integrity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Critical Precursor Incident Stream */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Critical SIF Triage Queue</h2>
              <p className="text-xs text-slate-500 mt-0.5">High-priority precursor events awaiting review</p>
            </div>
            <Link
              href="/app/triage"
              className="text-xs font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1 transition"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
            </Link>
          </div>

          <div className="space-y-3.5">
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
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                      {item.id}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                      pSIF {item.risk}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <MapPin className="h-3 w-3 text-slate-400" strokeWidth={1.8} />
                    <span>{item.site}</span>
                  </div>
                </div>

                <p className="text-sm font-normal text-slate-700 leading-relaxed">
                  {item.narrative}
                </p>

                <div className="flex items-center justify-between text-xs font-medium text-slate-600 pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5 text-amber-600" strokeWidth={1.8} />
                    <span className="font-semibold text-slate-800">{item.rule}</span>
                  </div>
                  <Link
                    href="/app/triage"
                    className="inline-flex items-center gap-1 text-slate-900 font-bold hover:text-blue-600 transition"
                  >
                    <span>Review</span>
                    <ArrowUpRight className="h-3 w-3" strokeWidth={1.8} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Barrier Health Status */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Critical Barrier Integrity</h2>
              <p className="text-xs text-slate-500 mt-0.5">IOGP 459 standard defense status</p>
            </div>
            <Link
              href="/app/barriers"
              className="text-xs font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1 transition"
            >
              <span>Matrix</span>
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
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
                  <div className="flex items-center gap-2">
                    {b.status === "VERIFIED" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2} />
                    ) : b.status === "DEGRADED" ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" strokeWidth={2} />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-rose-500" strokeWidth={2} />
                    )}
                    <span className="font-semibold text-slate-800">{b.name}</span>
                  </div>
                  <span
                    className={`font-mono font-bold ${
                      b.status === "VERIFIED"
                        ? "text-emerald-700"
                        : b.status === "DEGRADED"
                        ? "text-amber-700"
                        : "text-rose-700"
                    }`}
                  >
                    {b.score}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      b.status === "VERIFIED"
                        ? "bg-emerald-500"
                        : b.status === "DEGRADED"
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${b.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" strokeWidth={1.8} />
              <span>Inspection Action</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              Degradation detected in <strong>PTW Cross-Signoff</strong> at Gujarat Terminal. Verification requested for active permit cycle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
