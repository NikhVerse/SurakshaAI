"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft, Layers, ShieldCheck, MapPin } from "lucide-react";
import { fetchApi, PrecursorCluster } from "@/lib/api";

export default function PrecursorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const clusterId = resolvedParams.id;
  const [cluster, setCluster] = useState<PrecursorCluster | null>(null);

  useEffect(() => {
    fetchApi<PrecursorCluster>(`/api/v1/precursors/${clusterId}`)
      .then((data) => setCluster(data))
      .catch((err) => console.error(err));
  }, [clusterId]);

  if (!cluster) {
    return (
      <div className="p-10 text-center text-xs font-bold text-slate-400">
        Loading precursor cluster intelligence...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 border-b border-slate-200 pb-3">
        <Link href="/app/precursors" className="hover:text-slate-900 transition flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Precursors</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-mono text-slate-700 font-bold">Cluster #{cluster.id.slice(0, 8)}</span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {cluster.name}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Unsupervised HDBSCAN pattern discovery grouping subtle weak signals
            </p>
          </div>
          <span
            className={`self-start sm:self-auto px-3 py-1 rounded-md text-xs font-bold ${
              cluster.trend_status === "INCREASING"
                ? "bg-rose-50 text-rose-800 border border-rose-200"
                : "bg-slate-100 text-slate-700 border border-slate-200"
            }`}
          >
            Trend: {cluster.trend_status}
          </span>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Synthesized Cluster Narrative
          </span>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/60 p-4 rounded-xl border border-slate-100">
            {cluster.summary}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Primary Hazard
            </span>
            <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">{cluster.primary_hazard}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Critical Barrier
            </span>
            <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">{cluster.primary_barrier}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Life-Saving Rule
            </span>
            <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">{cluster.primary_lsr}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Coherence
            </span>
            <p className="font-black text-emerald-700 text-xl font-mono">
              {(cluster.coherence_score * 100).toFixed(0)}%
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-2">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Affected Operational Sites
          </h2>
          <div className="flex flex-wrap gap-2">
            {cluster.affected_sites.map((site) => (
              <span
                key={site}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
              >
                <MapPin className="h-3 w-3 text-slate-400" />
                <span>{site}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
