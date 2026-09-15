"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Layers, TrendingUp, TrendingDown, Minus, MapPin, Activity, ArrowRight } from "lucide-react";
import { precursorsApi, PrecursorCluster } from "@/lib/api";

function TrendBadge({ trend }: { trend: string }) {
  switch (trend) {
    case "INCREASING": return (
      <span className="badge badge-danger flex items-center gap-1">
        <TrendingUp className="h-3 w-3" /> Increasing
      </span>
    );
    case "DECREASING": return (
      <span className="badge badge-success flex items-center gap-1">
        <TrendingDown className="h-3 w-3" /> Decreasing
      </span>
    );
    default: return (
      <span className="badge badge-neutral flex items-center gap-1">
        <Minus className="h-3 w-3" /> Stable
      </span>
    );
  }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch { return iso; }
}

export default function PrecursorsPage() {
  const [clusters, setClusters] = useState<PrecursorCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    precursorsApi.list().then(setClusters).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title">Precursor Intelligence</h1>
        <p className="text-body mt-1.5">
          AI-discovered recurring patterns that signal systemic risk before fatal events occur.
          Clusters are automatically identified using HDBSCAN semantic analysis.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="card p-6 skeleton h-40" />)}
        </div>
      ) : error ? (
        <div className="card p-6" style={{ borderColor: "var(--danger)", color: "var(--danger)" }}>
          <p className="font-bold">Error loading precursor clusters</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : clusters.length === 0 ? (
        <div className="empty-state card py-20">
          <Layers className="h-12 w-12" style={{ color: "var(--fg-4)" }} />
          <p className="font-semibold">No precursor clusters identified yet</p>
          <p className="text-meta">Submit more incident reports to enable pattern analysis</p>
        </div>
      ) : (
        <div className="space-y-5">
          {clusters.map((c) => (
            <div key={c.id} className="card overflow-hidden">
              <div className="p-5 flex flex-col md:flex-row md:items-start gap-5">
                {/* Coherence indicator */}
                <div className="shrink-0">
                  <div
                    className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center"
                    style={{ background: "var(--fg)", color: "var(--bg)" }}
                  >
                    <p className="text-lg font-black leading-none">{Math.round(c.coherence_score * 100)}</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider opacity-70">Coherence</p>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex flex-wrap items-start gap-2">
                    <p className="text-section leading-snug flex-1 min-w-0">{c.name}</p>
                    <TrendBadge trend={c.trend_status} />
                  </div>

                  <p className="text-body leading-relaxed">{c.summary}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                    <div className="rounded-xl p-3" style={{ background: "var(--bg-subtle)" }}>
                      <p className="text-caption">Occurrences</p>
                      <p className="text-data text-xl mt-1">{c.occurrence_count}</p>
                    </div>
                    <div className="rounded-xl p-3" style={{ background: "var(--bg-subtle)" }}>
                      <p className="text-caption">Primary Hazard</p>
                      <p className="text-body font-bold mt-1 leading-snug">{c.primary_hazard}</p>
                    </div>
                    <div className="rounded-xl p-3" style={{ background: "var(--bg-subtle)" }}>
                      <p className="text-caption">Lead Barrier</p>
                      <p className="text-body font-bold mt-1 leading-snug">{c.primary_barrier || "—"}</p>
                    </div>
                    <div className="rounded-xl p-3" style={{ background: "var(--bg-subtle)" }}>
                      <p className="text-caption">Primary LSR</p>
                      <p className="text-body font-bold mt-1 leading-snug">{c.primary_lsr || "—"}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--fg-4)" }} />
                      {c.affected_sites.map((s) => (
                        <span key={s} className="badge badge-neutral">{s}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-meta" style={{ color: "var(--fg-4)" }}>
                      <span>First: {formatDate(c.first_seen)}</span>
                      <span>·</span>
                      <span>Latest: {formatDate(c.latest_seen)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {c.example_report_ids.length > 0 && (
                <div
                  className="px-5 py-3 flex items-center justify-between"
                  style={{ borderTop: "1px solid var(--border)", background: "var(--bg-subtle)" }}
                >
                  <p className="text-meta">
                    {c.example_report_ids.length} linked incident{c.example_report_ids.length !== 1 ? "s" : ""}
                    {" · "}{c.example_report_ids.slice(0, 3).join(", ")}
                  </p>
                  <Link
                    href={`/app/reports?cluster=${c.id}`}
                    className="btn btn-secondary h-8 text-xs px-3"
                  >
                    View Reports <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
