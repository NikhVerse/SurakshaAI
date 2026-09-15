"use client";

import React, { useEffect, useState } from "react";
import { Cpu, CheckCircle, AlertCircle, ZapOff } from "lucide-react";
import { systemApi, ModelHealth } from "@/lib/api";

function StatusPill({ status }: { status: string }) {
  const cls = status === "HEALTHY" || status === "OPTIMAL" ? "badge-success"
    : status === "DEGRADED" ? "badge-danger" : "badge-neutral";
  return <span className={`badge ${cls}`}>{status}</span>;
}

function StatRow({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--border)" }}>
      <span className="text-meta">{label}</span>
      <span className="text-code text-xs font-bold" style={{ color: "var(--fg)" }}>
        {value}{unit}
      </span>
    </div>
  );
}

export default function ModelHealthPage() {
  const [health, setHealth] = useState<ModelHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    systemApi.getModelHealth().then(setHealth).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div className="text-page-title skeleton h-10 w-64 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="card p-6 skeleton h-56" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title">Model Health & MLOps</h1>
        <p className="text-body mt-1.5">Real-time diagnostic view of all AI/ML pipeline components.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* NLP */}
        <div className="card p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-caption">NLP Engine</p>
              <p className="text-subsection mt-0.5">Entity Extraction</p>
            </div>
            {health?.nlp && <StatusPill status={health.nlp.status} />}
          </div>
          {health?.nlp && (
            <div>
              <StatRow label="Model" value={health.nlp.model} />
              <StatRow label="Version" value={health.nlp.version} />
              <StatRow label="Avg Latency" value={health.nlp.average_latency_ms} unit="ms" />
              <StatRow label="Extraction Confidence" value={`${(health.nlp.extraction_confidence_avg * 100).toFixed(1)}`} unit="%" />
            </div>
          )}
        </div>

        {/* PSIF */}
        <div className="card p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-caption">Risk Prediction</p>
              <p className="text-subsection mt-0.5">pSIF Ensemble</p>
            </div>
            {health?.psif && <StatusPill status={health.psif.status} />}
          </div>
          {health?.psif && (
            <div>
              <StatRow label="Calibration" value={health.psif.calibration_method} />
              <StatRow label="Calibrated Records" value={`${health.psif.calibration_percentage}`} unit="%" />
              <StatRow label="PR-AUC" value={health.psif.pr_auc} />
              <StatRow label="F2-Score" value={health.psif.f2_score} />
              <StatRow label="Total Evaluated" value={health.psif.total_evaluated_records} />
            </div>
          )}
        </div>

        {/* LSR */}
        <div className="card p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-caption">Rule Classification</p>
              <p className="text-subsection mt-0.5">LSR Multi-Label</p>
            </div>
            {health?.lsr && <StatusPill status={health.lsr.status} />}
          </div>
          {health?.lsr && (
            <div>
              <StatRow label="Model" value={health.lsr.model} />
              <StatRow label="Supported Rules" value={health.lsr.supported_rules} />
              <StatRow label="Macro F1" value={health.lsr.macro_f1} />
              <StatRow label="Micro F1" value={health.lsr.micro_f1} />
            </div>
          )}
        </div>

        {/* LLM */}
        <div className="card p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-caption">Language Model</p>
              <p className="text-subsection mt-0.5">Ollama (Local)</p>
            </div>
            {Boolean(health?.llm) && (
              <StatusPill status={String((health?.llm as Record<string, string | number | boolean>)?.status) === "connected" ? "HEALTHY" : "DEGRADED"} />
            )}
          </div>
          {Boolean(health?.llm) && (
            <div>
              {Object.entries((health?.llm as Record<string, string | number | boolean>) || {}).slice(0, 5).map(([k, v]) => (
                <StatRow key={k} label={k.replace(/_/g, " ")} value={String(v || "—")} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Data Drift */}
      {health?.data_drift && (
        <div className="card p-5">
          <p className="text-subsection mb-4">Data Drift Monitoring</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(health.data_drift).map(([k, v]) => (
              <div key={k} className="rounded-xl p-3" style={{ background: "var(--bg-subtle)" }}>
                <p className="text-caption">{k.replace(/_/g, " ")}</p>
                <p className="text-body font-bold mt-1" style={{ color: v.includes("NONE") || v.includes("LOW") || v.includes("WITHIN") ? "var(--success)" : "var(--warning)" }}>
                  {v}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
