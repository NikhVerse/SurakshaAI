"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight, ShieldAlert, Activity, FileText, ArrowUpRight } from "lucide-react";
import { fetchApi } from "@/lib/api";
import AssetImage from "@/components/ui/AssetImage";
import DetailDrawer, { DrawerData } from "@/components/ui/DetailDrawer";
import { StatusDot, RiskScore } from "@/components/ui/StatusSystem";

export default function SitesPage() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Detail Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null);

  useEffect(() => {
    fetchApi<any[]>("/api/v1/sites")
      .then((data) => setSites(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const openDrawer = (s: any) => {
    setDrawerData({
      id: s.id,
      uid: s.code,
      title: s.name,
      severity: s.risk_level,
      status: "ONLINE",
      riskScore: s.risk_level === "CRITICAL" ? 0.88 : s.risk_level === "HIGH" ? 0.72 : 0.45,
      location: s.location,
      timestamp: "Live Telemetry Connected",
      narrative: `High-hazard operational asset: ${s.name} (${s.operational_unit}). Monitored for critical precursor weeping, barrier degradation, and PTW compliance under OISD standards.`,
      primaryBarrier: "Engineered ESD & Isolation Matrix",
      barrierState: "Verified",
      metrics: [
        { label: "Monitored Reports", value: s.total_reports || 0 },
        { label: "Critical Precursors", value: s.psif_count || 0 },
      ],
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
            Assets
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Operational complexes, installations &amp; precursor density
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono">
          <StatusDot status="ONLINE" pulse size="sm" />
          <span>5 Online</span>
        </div>
      </div>

      {/* 12. Visual Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sites.map((s) => {
          const riskVal = s.risk_level === "CRITICAL" ? 0.88 : s.risk_level === "HIGH" ? 0.72 : 0.45;
          return (
            <div
              key={s.id}
              onClick={() => openDrawer(s)}
              className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3.5 shadow-2xs hover:border-slate-300 transition cursor-pointer flex flex-col justify-between group"
            >
              {/* Category-Accurate Visual Asset Image */}
              <AssetImage assetCode={s.code} name={s.name} height={120} />

              {/* Asset Name & Location */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {s.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <StatusDot status="ONLINE" size="sm" />
                    <span className="text-[10px] font-bold font-mono text-emerald-600">
                      ONLINE
                    </span>
                  </div>
                </div>

                <h2 className="text-base font-bold text-slate-900 truncate mt-1">
                  {s.name}
                </h2>

                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-0.5">
                  <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                  <span className="truncate">{s.location}</span>
                </div>
              </div>

              {/* Number-First Telemetry Strip */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-center">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Reports
                  </span>
                  <span className="text-base font-black font-mono text-slate-900 block mt-0.5">
                    {s.total_reports || 0}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-rose-50/50 border border-rose-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                    Critical SIF
                  </span>
                  <span className="text-base font-black font-mono text-rose-600 block mt-0.5">
                    {s.psif_count || 0}
                  </span>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <RiskScore score={riskVal} size="sm" showLabel />

                <span className="font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-1">
                  Inspect
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
