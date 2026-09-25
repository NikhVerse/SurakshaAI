"use client";

import React, { useEffect, useState } from "react";
import {
  Shield,
  ArrowUpRight,
  Lock,
  Flame,
  FileCheck,
  Wind,
  Power,
  Camera,
} from "lucide-react";
import { taxonomyApi, Barrier, BarrierHealthItem, dashboardApi } from "@/lib/api";
import DetailDrawer, { DrawerData } from "@/components/ui/DetailDrawer";
import Tooltip from "@/components/ui/Tooltip";
import { StatusDot } from "@/components/ui/StatusSystem";
import { getEvidenceForBarrier, getStandardsForBarrier } from "@/lib/evidenceData";

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  "BAR-ENG-01": Lock,
  "BAR-PHYS-02": Flame,
  "BAR-PROC-03": FileCheck,
  "BAR-ENG-04": Wind,
  "BAR-ENG-05": Power,
};

export default function BarriersPage() {
  const [barriers, setBarriers] = useState<Barrier[]>([]);
  const [health, setHealth] = useState<BarrierHealthItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Detail Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null);

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

  const openDrawer = (b: Barrier, h?: BarrierHealthItem) => {
    const total = h ? h.verified + h.unverified + h.failed : 0;
    const failRate = total > 0 && h ? Math.round((h.failed / total) * 100) : 0;
    const isVerified = total === 0 || failRate <= 20;

    const evidence = getEvidenceForBarrier(b.code);
    const standards = getStandardsForBarrier(b.code);

    setDrawerData({
      id: b.code,
      uid: b.code,
      title: b.name,
      severity: failRate > 40 ? "CRITICAL" : failRate > 20 ? "HIGH" : "HEALTHY",
      status: isVerified ? "VERIFIED" : "DEGRADED",
      riskScore: failRate / 100,
      location: `Category: ${b.category}`,
      timestamp: "IOGP Report 459 Standard",
      narrative: b.expected_function || "Critical process safety defense barrier.",
      primaryBarrier: b.name,
      barrierState: total > 0 ? (isVerified ? "Verified" : "Degraded") : "No Activity",
      metrics: [
        { label: "Verified Cases", value: h?.verified || 0 },
        { label: "Failure Count", value: h?.failed || 0 },
        { label: "Evaluated Reports", value: total },
      ],
      evidenceImages: evidence,
      externalSources: standards,
      onConfirm: () => {
        // Confirm barrier audit
      },
    });
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 font-sans">
      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data={drawerData}
      />

      {/* Header — 1-2 words */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Barrier Matrix
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            IOGP 459 critical barrier integrity &amp; failure rate analytics
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold font-mono">
          <StatusDot status="HEALTHY" size="sm" />
          <span>{barriers.length} Monitored Barriers</span>
        </div>
      </div>

      {/* 14. Visual Barrier Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? [...Array(6)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-slate-100 animate-pulse" />
            ))
          : barriers.length === 0 ? (
              <div className="col-span-full py-12 text-center text-xs font-semibold text-slate-400 bg-white rounded-2xl border border-slate-200">
                No barriers found in the database.
              </div>
            ) : barriers.map((b) => {
              const h = healthByCode[b.code];
              const total = h ? h.verified + h.unverified + h.failed : 0;
              const failCount = h ? h.failed : 0;
              const failRate = total > 0 ? Math.round((failCount / total) * 100) : 0;
              const healthScore = total > 0 ? 100 - failRate : 100;
              const isHealthy = failRate <= 20;
              const Icon = iconMap[b.code] || Shield;

              return (
                <div
                  key={b.id}
                  onClick={() => openDrawer(b, h)}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition cursor-pointer flex flex-col justify-between space-y-3 shadow-2xs group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Tooltip content={`${b.name} (${b.category})`}>
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                          <Icon className="h-4 w-4" strokeWidth={1.8} />
                        </div>
                        <div>
                          <span className="font-bold text-sm text-slate-900 block truncate max-w-[200px]">
                            {b.name.split(" ")[0]} {b.name.split(" ")[1] || ""}
                          </span>
                          <span className="font-mono text-[11px] text-slate-400 font-bold block">
                            {b.code}
                          </span>
                        </div>
                      </div>
                    </Tooltip>

                    <div className="flex items-center gap-1.5 font-mono">
                      <span
                        className={`text-base font-black ${
                          isHealthy ? "text-emerald-600" : "text-amber-600"
                        }`}
                      >
                        {total > 0 ? `${healthScore}%` : "100%"}
                      </span>
                      <StatusDot status={isHealthy ? "HEALTHY" : "DEGRADED"} size="sm" />
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="space-y-1">
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isHealthy ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${healthScore}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400">
                      <span>{failCount} Failures</span>
                      <span>{total} Evaluated</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                        {b.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100/70 px-1.5 py-0.5 rounded border border-slate-200">
                        <Camera className="h-3 w-3 text-slate-500" />
                        <span>Evidence</span>
                      </span>
                    </div>

                    <span className="font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-0.5">
                      Audit
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
