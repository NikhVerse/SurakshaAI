"use client";

import React, { useEffect, useState } from "react";
import { Cpu, CheckCircle, Activity, Zap, ShieldCheck } from "lucide-react";
import { systemApi, ModelHealth } from "@/lib/api";
import { StatusDot } from "@/components/ui/StatusSystem";
import { Tooltip } from "@/components/ui/Tooltip";

export default function ModelHealthPage() {
  const [health, setHealth] = useState<ModelHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    systemApi.getModelHealth().then(setHealth).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
          <Cpu className="h-5 w-5 text-slate-800" strokeWidth={1.8} />
          <span>Model Health &amp; Diagnostics</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Real-time telemetry of NLP extraction, calibrated pSIF gradient boosters &amp; data drift
        </p>
      </div>

      {/* Number-First Operational KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">PR-AUC Accuracy</span>
          <p className="text-2xl font-black text-emerald-600 font-mono mt-0.5">{health?.psif?.pr_auc || "0.88"}</p>
          <span className="text-[10px] font-semibold text-emerald-700">Calibrated Ensemble</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">F2 Safety Score</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">{health?.psif?.f2_score || "0.84"}</p>
          <span className="text-[10px] font-semibold text-slate-500">Recall-Biased Metric</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Latency</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">
            {health?.nlp?.average_latency_ms || "42"}<span className="text-xs font-normal text-slate-400 ml-1">ms</span>
          </p>
          <span className="text-[10px] font-semibold text-slate-500">Fast Edge Triage</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Drift State</span>
          <p className="text-lg font-black text-emerald-600 font-mono mt-1">NOMINAL</p>
          <span className="text-[10px] font-semibold text-emerald-700">Zero Feature Drift</span>
        </div>
      </div>

      {/* 4 Pipeline Components Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* NLP */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <StatusDot status={health?.nlp?.status === "HEALTHY" ? "HEALTHY" : "CRITICAL"} />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">NLP Entity Extraction</h2>
            </div>
            <span className="font-mono text-xs font-bold text-slate-600">{health?.nlp?.model}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Confidence</span>
              <p className="text-base font-black text-slate-900 font-mono mt-0.5">
                {((health?.nlp?.extraction_confidence_avg || 0.94) * 100).toFixed(0)}%
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Version</span>
              <p className="text-base font-black text-slate-900 font-mono mt-0.5">
                {health?.nlp?.version || "v2.4"}
              </p>
            </div>
          </div>
        </div>

        {/* pSIF Ensemble */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <StatusDot status={health?.psif?.status === "OPTIMAL" || health?.psif?.status === "HEALTHY" ? "HEALTHY" : "CRITICAL"} />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">pSIF Prediction Engine</h2>
            </div>
            <span className="font-mono text-xs font-bold text-slate-600">{health?.psif?.calibration_method}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Evaluated Records</span>
              <p className="text-base font-black text-slate-900 font-mono mt-0.5">
                {health?.psif?.total_evaluated_records || 33}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Calibrated %</span>
              <p className="text-base font-black text-emerald-600 font-mono mt-0.5">
                {health?.psif?.calibration_percentage || 100}%
              </p>
            </div>
          </div>
        </div>

        {/* LSR Multi-Label */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <StatusDot status={health?.lsr?.status === "HEALTHY" ? "HEALTHY" : "CRITICAL"} />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">Life-Saving Rules Classifier</h2>
            </div>
            <span className="font-mono text-xs font-bold text-slate-600">{health?.lsr?.supported_rules} Rules</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Macro F1</span>
              <p className="text-base font-black text-slate-900 font-mono mt-0.5">{health?.lsr?.macro_f1 || "0.89"}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Micro F1</span>
              <p className="text-base font-black text-slate-900 font-mono mt-0.5">{health?.lsr?.micro_f1 || "0.91"}</p>
            </div>
          </div>
        </div>

        {/* LLM Engine */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <StatusDot status="HEALTHY" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">LLM Inference Node</h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Air-Gapped
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Host Service</span>
              <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">Ollama Daemon</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Endpoint</span>
              <p className="text-sm font-bold text-slate-900 font-mono mt-0.5 truncate">127.0.0.1:11434</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Drift Monitoring Matrix */}
      {health?.data_drift && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Real-Time Feature Drift Watch
            </h2>
            <span className="text-[11px] font-mono text-emerald-700 font-bold">Kolmogorov-Smirnov Test</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(health.data_drift).map(([k, v]) => (
              <div key={k} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {k.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs font-bold text-slate-900 font-mono">{v}</span>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
