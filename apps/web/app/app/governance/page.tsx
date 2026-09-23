"use client";

import React, { useEffect, useState } from "react";
import { Shield, CheckCircle, Server, BookOpen, AlertCircle, Lock, Cpu } from "lucide-react";
import { systemApi } from "@/lib/api";
import { StatusDot } from "@/components/ui/StatusSystem";
import { Tooltip } from "@/components/ui/Tooltip";

export default function GovernancePage() {
  const [gov, setGov] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    systemApi
      .getGovernance()
      .then((g) => setGov(g as Record<string, string>))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const items = gov
    ? Object.entries(gov).map(([k, v]) => ({
        key: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        value: String(v),
      }))
    : [];

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
          <Shield className="h-5 w-5 text-slate-800" strokeWidth={1.8} />
          <span>AI Governance</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Model governance framework, data sovereignty policy &amp; regulatory adherence
        </p>
      </div>

      {/* Number-First Operational KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">HITL Gating</span>
          <p className="text-2xl font-black text-emerald-600 font-mono mt-0.5">100%</p>
          <span className="text-[10px] font-semibold text-emerald-700">Mandatory Human Review</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Data Egress</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">0 KB</p>
          <span className="text-[10px] font-semibold text-slate-500">Air-Gapped On-Prem</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Framework</span>
          <p className="text-lg font-black text-slate-900 font-mono mt-1">IOGP 459</p>
          <span className="text-[10px] font-semibold text-slate-500">9 Life-Saving Rules</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Audit Storage</span>
          <p className="text-lg font-black text-slate-900 font-mono mt-1">Immutable</p>
          <span className="text-[10px] font-semibold text-slate-500">Append-Only Cryptographic</span>
        </div>
      </div>

      {/* 4 Visual Policy Cards (Low-Text with Tooltips) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            icon: CheckCircle,
            title: "Human-in-the-Loop",
            status: "MANDATORY",
            color: "text-emerald-700",
            bg: "bg-emerald-50",
            border: "border-emerald-200",
            tooltip: "SurakshaAI is a decision-support system. All triage decisions and risk assessments require human review before operational action.",
            meta: "L4 Certified Approver Required",
          },
          {
            icon: Server,
            title: "Data Sovereignty",
            status: "AIR-GAPPED",
            color: "text-blue-700",
            bg: "bg-blue-50",
            border: "border-blue-200",
            tooltip: "All incident narrative data is processed entirely on-premises. Zero cloud transmission of operational HSE data. Ollama runs locally.",
            meta: "Zero Network Egress",
          },
          {
            icon: BookOpen,
            title: "IOGP Standard Alignment",
            status: "VERIFIED",
            color: "text-slate-800",
            bg: "bg-slate-100",
            border: "border-slate-200",
            tooltip: "Taxonomy grounded in IOGP Life-Saving Rules (9 Rules) and IOGP Report 459 Barrier Classification. All AI outputs reference industry-standard frameworks.",
            meta: "Report 459 & OISD-145",
          },
          {
            icon: AlertCircle,
            title: "Safety Advisory Scope",
            status: "ADVISORY",
            color: "text-amber-700",
            bg: "bg-amber-50",
            border: "border-amber-200",
            tooltip: "SurakshaAI identifies patterns and signal quality in safety observations to support expert HSE decision-making. It does not predict future accidents.",
            meta: "Decision Support Only",
          },
        ].map((policy) => {
          const Icon = policy.icon;
          return (
            <Tooltip key={policy.title} content={policy.tooltip}>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition flex items-center justify-between gap-4 cursor-help">
                <div className="flex items-center gap-3.5">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${policy.bg} ${policy.color} border ${policy.border}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">{policy.title}</h2>
                    <span className="text-xs text-slate-400 font-medium block mt-0.5">{policy.meta}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${policy.bg} ${policy.color} ${policy.border} shrink-0`}>
                  {policy.status}
                </span>
              </div>
            </Tooltip>
          );
        })}
      </div>

      {/* Governed System Parameters Matrix */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Governance Parameters
          </span>
          <span className="text-[11px] font-mono text-slate-400">Pydantic v2 Enforced</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map(({ key, value }) => (
              <div key={key} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                  {key}
                </span>
                <p className="text-xs font-bold text-slate-900 font-mono truncate">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
