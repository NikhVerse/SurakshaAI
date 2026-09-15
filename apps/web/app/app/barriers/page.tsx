"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, ShieldX, ShieldAlert, Shield, ArrowUpRight } from "lucide-react";
import { taxonomyApi, systemApi, Barrier, DashboardSummary, BarrierHealthItem } from "@/lib/api";
import { dashboardApi } from "@/lib/api";

const stateIcon = (state: string) => {
  switch (state) {
    case "Present": return <ShieldCheck className="h-4 w-4" style={{ color: "var(--success)" }} />;
    case "Degraded": return <ShieldAlert className="h-4 w-4" style={{ color: "var(--warning)" }} />;
    case "Failed": case "Absent": case "Bypassed": return <ShieldX className="h-4 w-4" style={{ color: "var(--danger)" }} />;
    default: return <Shield className="h-4 w-4" style={{ color: "var(--fg-4)" }} />;
  }
};

export default function BarriersPage() {
  const [barriers, setBarriers] = useState<Barrier[]>([]);
  const [health, setHealth] = useState<BarrierHealthItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([taxonomyApi.getBarriers(), dashboardApi.getSummary()])
      .then(([b, s]) => {
        setBarriers(b);
        setHealth(s.barrier_health);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const healthByCode = Object.fromEntries(health.map((h) => [h.code, h]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title">Barrier Integrity</h1>
        <p className="text-body mt-1.5">IOGP-aligned safety barrier registry with live performance analytics from incident data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => <div key={i} className="card p-5 skeleton h-36" />)
        ) : barriers.map((b) => {
          const h = healthByCode[b.code];
          const total = h ? h.verified + h.unverified + h.failed : 0;
          const failRate = total > 0 ? Math.round((h.failed / total) * 100) : 0;
          const stateLabel = failRate > 40 ? "Failed" : failRate > 20 ? "Degraded" : "Present";
          return (
            <div key={b.id} className="card p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-caption">{b.code} · {b.category}</p>
                  <p className="text-subsection mt-1 leading-snug">{b.name}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {stateIcon(stateLabel)}
                  <span className="text-meta">{stateLabel}</span>
                </div>
              </div>
              <p className="text-body-2 line-clamp-2">{b.expected_function}</p>
              {total > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-meta">
                    <span>{h.verified} Verified</span>
                    <span style={{ color: "var(--danger)" }}>{h.failed} Failed</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-subtle)" }}>
                    <div className="h-full rounded-full" style={{ width: `${failRate}%`, background: failRate > 30 ? "var(--danger)" : failRate > 15 ? "var(--warning)" : "var(--success)" }} />
                  </div>
                  <p className="text-meta">{failRate}% barrier failure rate · {total} incidents evaluated</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
