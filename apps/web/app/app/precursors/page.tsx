"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layers,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  ArrowRight,
  Shield,
  Flame,
  Wind,
  Zap,
  Activity,
  Filter,
} from "lucide-react";
import { precursorsApi, PrecursorCluster } from "@/lib/api";
import { DetailDrawer } from "@/components/ui/DetailDrawer";
import { Tooltip } from "@/components/ui/Tooltip";
import { TrendIndicator, Sparkline } from "@/components/ui/VisualGauges";
import { getEvidenceForBarrier, getStandardsForBarrier } from "@/lib/evidenceData";

export default function PrecursorsPage() {
  const [clusters, setClusters] = useState<PrecursorCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<PrecursorCluster | null>(null);
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    precursorsApi
      .list()
      .then(setClusters)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const totalOccurrences = clusters.reduce((acc, c) => acc + (c.occurrence_count || 0), 0);
  const criticalClusters = clusters.filter((c) => c.trend_status === "INCREASING").length;
  const uniqueSites = Array.from(new Set(clusters.flatMap((c) => c.affected_sites || [])));

  const filteredClusters = clusters.filter((c) => {
    if (activeFilter === "INCREASING") return c.trend_status === "INCREASING";
    if (activeFilter === "STABLE") return c.trend_status !== "INCREASING" && c.trend_status !== "DECREASING";
    return true;
  });

  const getHazardIcon = (hazard: string) => {
    const h = (hazard || "").toLowerCase();
    if (h.includes("gas") || h.includes("vapor")) return Wind;
    if (h.includes("fire") || h.includes("hot work") || h.includes("ignition")) return Flame;
    if (h.includes("pressure") || h.includes("isolation")) return Shield;
    return Zap;
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <Layers className="h-5 w-5 text-slate-800" strokeWidth={1.8} />
            <span>Precursor Signals</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Systemic recurrence patterns and weak signals detected prior to major loss of containment
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {["ALL", "INCREASING", "STABLE"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeFilter === tab
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab === "ALL" ? "All Clusters" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Number-First Operational KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Clusters</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">
            {clusters.length < 10 ? `0${clusters.length}` : clusters.length}
          </p>
          <span className="text-[11px] font-semibold text-slate-500">HDBSCAN Semantic</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">High Hazard</span>
          <p className="text-2xl font-black text-rose-600 font-mono mt-0.5">
            {criticalClusters < 10 ? `0${criticalClusters}` : criticalClusters}
          </p>
          <span className="text-[11px] font-semibold text-rose-700">Increasing Trend</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Signals</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">{totalOccurrences}</p>
          <span className="text-[11px] font-semibold text-slate-500">Correlated Records</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Sites Exposed</span>
          <p className="text-2xl font-black text-blue-600 font-mono mt-0.5">
            {uniqueSites.length < 10 ? `0${uniqueSites.length}` : uniqueSites.length}
          </p>
          <span className="text-[11px] font-semibold text-blue-700">Cross-Plant Patterns</span>
        </div>
      </div>

      {/* Visual Cluster Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 h-44 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800 text-xs font-semibold">
          Error loading precursor signals: {error}
        </div>
      ) : filteredClusters.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400 text-xs font-medium">
          No matching precursor clusters found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClusters.map((c) => {
            const HazardIcon = getHazardIcon(c.primary_hazard);
            const coherencePct = Math.round(c.coherence_score * 100);
            const isIncreasing = c.trend_status === "INCREASING";

            return (
              <div
                key={c.id}
                onClick={() => setSelectedCluster(c)}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 hover:shadow-xs transition cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                {/* Header: Coherence Number + Short Title + Trend */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-slate-900 text-white shrink-0 shadow-2xs">
                      <span className="text-base font-black font-mono leading-none">{coherencePct}%</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider opacity-70 mt-0.5">Score</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition truncate max-w-[220px]">
                          {c.name}
                        </h2>
                      </div>
                      <span className="text-[12px] font-mono text-slate-400 block mt-0.5">
                        {c.occurrence_count} linked observations
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    <TrendIndicator
                      direction={isIncreasing ? "up" : "flat"}
                      label={c.trend_status}
                      isPositive={!isIncreasing}
                    />
                  </div>
                </div>

                {/* Level 1 Metric Chips: Hazard, Barrier, LSR */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Hazard</span>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-800 truncate">
                      <HazardIcon className="h-3 w-3 text-amber-600 shrink-0" />
                      <span className="truncate">{c.primary_hazard.split(" ")[0]}</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Barrier</span>
                    <span className="text-xs font-bold text-slate-800 truncate block">
                      {c.primary_barrier ? c.primary_barrier.split(" ")[0] : "—"}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Rule</span>
                    <span className="text-xs font-bold text-slate-800 truncate block">
                      {c.primary_lsr ? c.primary_lsr.split(" ")[0] : "—"}
                    </span>
                  </div>
                </div>

                {/* Footer: Sites tags + Action */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <div className="flex items-center gap-1 truncate">
                      {c.affected_sites.slice(0, 2).map((site) => (
                        <span key={site} className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {site}
                        </span>
                      ))}
                      {c.affected_sites.length > 2 && (
                        <span className="text-[11px] font-bold text-slate-400">+{c.affected_sites.length - 2}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 font-bold text-slate-700 group-hover:text-slate-900 transition shrink-0">
                    <span>Inspect</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Universal Detail Drawer for Precursor Cluster */}
      <DetailDrawer
        isOpen={Boolean(selectedCluster)}
        onClose={() => setSelectedCluster(null)}
        data={
          selectedCluster
            ? {
                id: selectedCluster.id,
                uid: `CLS-${selectedCluster.id.slice(0, 8)}`,
                title: selectedCluster.name,
                category: selectedCluster.primary_hazard,
                severity:
                  selectedCluster.trend_status === "INCREASING"
                    ? "CRITICAL"
                    : "HEALTHY",
                status:
                  selectedCluster.trend_status === "INCREASING"
                    ? "CRITICAL ESCALATION"
                    : "MONITORED",
                riskScore: selectedCluster.coherence_score,
                location: selectedCluster.affected_sites?.join(", "),
                timestamp: `HDBSCAN Coherence ${Math.round(
                  selectedCluster.coherence_score * 100
                )}%`,
                narrative: selectedCluster.summary,
                primaryBarrier: selectedCluster.primary_barrier,
                barrierState: "Precursor Recurrence",
                metrics: [
                  {
                    label: "Signals",
                    value: selectedCluster.occurrence_count || 0,
                  },
                  {
                    label: "Coherence",
                    value: `${Math.round(
                      (selectedCluster.coherence_score || 0) * 100
                    )}%`,
                  },
                  {
                    label: "Primary Hazard",
                    value: selectedCluster.primary_hazard || "—",
                  },
                  {
                    label: "Barrier",
                    value: selectedCluster.primary_barrier || "—",
                  },
                ],
                evidenceImages: getEvidenceForBarrier(
                  selectedCluster.primary_barrier
                ),
                externalSources: getStandardsForBarrier(
                  selectedCluster.primary_barrier
                ),
              }
            : null
        }
      />
    </div>
  );
}
