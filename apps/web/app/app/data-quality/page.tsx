"use client";

import React from "react";
import { Database, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function DataQualityPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Balanced Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Data Quality &amp; Governance
        </h1>
        <p className="text-sm sm:text-base font-medium text-slate-500 mt-1">
          Validation layer enforcing schema compliance, character encoding, and provenance tagging
        </p>
      </div>

      {/* 4 Balanced Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Schema Compliance</span>
          <p className="text-3xl font-black text-emerald-700 tracking-tight font-mono">100%</p>
          <span className="text-xs text-slate-500 block font-medium">Pydantic v2 Validated</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Missing Narratives</span>
          <p className="text-3xl font-black text-slate-900 tracking-tight font-mono">0</p>
          <span className="text-xs text-slate-500 block font-medium">Non-empty enforcement</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Duplicates Detected</span>
          <p className="text-3xl font-black text-slate-900 tracking-tight font-mono">0</p>
          <span className="text-xs text-slate-500 block font-medium">UID hash deduplicated</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Origin Tagging</span>
          <p className="text-3xl font-black text-sky-600 tracking-tight font-mono">100%</p>
          <span className="text-xs text-slate-500 block font-medium">Strict Provenance</span>
        </div>
      </div>

      {/* Ingestion Integrity Policies */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          Active Ingestion Integrity Policies
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
            <span>Temporal leakage prevention: triage models strictly exclude post-incident investigation findings.</span>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
            <span>Prompt injection protection: incident narratives are sanitized and treated strictly as untrusted inputs.</span>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
            <span>Data segregation: synthetic demonstration records are separated from operational databases.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
