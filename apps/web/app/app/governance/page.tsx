"use client";

import React, { useEffect, useState } from "react";
import { Shield, CheckCircle, AlertCircle, Server, BookOpen } from "lucide-react";
import { systemApi } from "@/lib/api";

export default function GovernancePage() {
  const [gov, setGov] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    systemApi.getGovernance().then((g) => setGov(g as Record<string, string>)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const items = gov
    ? Object.entries(gov).map(([k, v]) => ({
        key: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        value: String(v),
      }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title">AI Governance</h1>
        <p className="text-body mt-1.5">Model governance metadata, data origin policy, and regulatory compliance context.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" style={{ color: "var(--primary)" }} />
            <p className="text-section">Governance Metadata</p>
          </div>
          {loading ? (
            [...Array(6)].map((_, i) => <div key={i} className="skeleton h-8 rounded-lg" />)
          ) : items.map(({ key, value }) => (
            <div key={key} className="flex flex-col gap-0.5">
              <p className="text-caption">{key}</p>
              <p className="text-body font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {[
            {
              icon: CheckCircle,
              title: "Human-in-the-Loop Mandatory",
              body: "SurakshaAI is a decision-support system, not an autonomous authority. All triage decisions and risk assessments require human review before operational action.",
              color: "var(--success)",
              bg: "var(--success-bg)",
            },
            {
              icon: Server,
              title: "Data Privacy — Local Only",
              body: "All incident narrative data is processed entirely on-premises. Zero cloud transmission of operational HSE data. Ollama runs locally.",
              color: "var(--primary)",
              bg: "var(--primary-bg)",
            },
            {
              icon: BookOpen,
              title: "IOGP Alignment",
              body: "Taxonomy grounded in IOGP Life-Saving Rules (9 Rules) and IOGP Report 459 Barrier Classification. All AI outputs reference industry-standard frameworks.",
              color: "var(--accent)",
              bg: "var(--accent-bg)",
            },
            {
              icon: AlertCircle,
              title: "System Disclaimer",
              body: "SurakshaAI does not predict accidents. It identifies patterns and signal quality in safety observations to support expert HSE decision-making.",
              color: "var(--warning)",
              bg: "var(--warning-bg)",
            },
          ].map(({ icon: Icon, title, body, color, bg }) => (
            <div key={title} className="card p-4 flex gap-3" style={{ borderColor: color + "40" }}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: bg }}>
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <div>
                <p className="text-subsection">{title}</p>
                <p className="text-body-2 mt-1">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
