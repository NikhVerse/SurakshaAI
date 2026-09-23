"use client";

import React from "react";
import { Database, CheckCircle2, ShieldCheck, FileCheck, Layers } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";

export default function DataQualityPage() {
  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
          <Database className="h-5 w-5 text-slate-800" strokeWidth={1.8} />
          <span>Data Quality &amp; Provenance</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Validation layer enforcing schema integrity, non-null narrative enforcement &amp; provenance tagging
        </p>
      </div>

      {/* 4 Number-First Primary Operational Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Schema Compliance</span>
          <p className="text-3xl font-black text-emerald-600 tracking-tight font-mono">100%</p>
          <span className="text-[11px] text-slate-500 block font-semibold">Pydantic v2 Validated</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Missing Narratives</span>
          <p className="text-3xl font-black text-slate-900 tracking-tight font-mono">0</p>
          <span className="text-[11px] text-slate-500 block font-semibold">Non-Empty Strict</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duplicates Detected</span>
          <p className="text-3xl font-black text-slate-900 tracking-tight font-mono">0</p>
          <span className="text-[11px] text-slate-500 block font-semibold">SHA-256 Deduplicated</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Provenance Tagging</span>
          <p className="text-3xl font-black text-blue-600 tracking-tight font-mono">100%</p>
          <span className="text-[11px] text-slate-500 block font-semibold">Strict Origin Tracing</span>
        </div>
      </div>

      {/* Visual Ingestion Integrity Policies Grid */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Ingestion Pipeline Controls
          </h2>
          <span className="text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Active Enforcement</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              title: "Temporal Leakage",
              status: "ENFORCED",
              desc: "Triage models strictly exclude post-incident findings to prevent lookahead bias.",
            },
            {
              title: "Prompt Injection Guard",
              status: "ACTIVE",
              desc: "Incident narratives are sanitized and treated strictly as untrusted inputs.",
            },
            {
              title: "Data Segregation",
              status: "VERIFIED",
              desc: "Synthetic demonstration records are separated from operational databases.",
            },
          ].map((item) => (
            <Tooltip key={item.title} content={item.desc}>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition flex items-center justify-between gap-3 cursor-help">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-900">{item.title}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  {item.status}
                </span>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
}
