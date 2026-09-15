"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ChevronRight, MapPin, ShieldAlert, ArrowLeft } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function SiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const siteId = resolvedParams.id;
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchApi<any>(`/api/v1/sites/${siteId}`)
      .then((res) => setData(res))
      .catch((err) => console.error(err));
  }, [siteId]);

  if (!data) return <div className="p-8 text-sm font-bold text-slate-500">Loading site intelligence...</div>;

  const s = data.site;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 border-b border-slate-200 pb-3">
        <Link href="/app/sites" className="hover:text-slate-900 transition flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>All Sites</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-mono text-slate-700">{s.code}</span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 block">
              Facility Complex Profile
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{s.name}</h1>
            <p className="text-xs text-slate-500 font-medium">
              {s.location} &bull; {s.operational_unit}
            </p>
          </div>
          <span className="rounded-md bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 text-xs font-bold self-start sm:self-auto">
            Risk Tier: {s.risk_level}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Reports</span>
            <p className="font-bold text-slate-900 text-xl font-mono">{data.total_reports}</p>
          </div>
          <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4 space-y-1">
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">pSIF Signals</span>
            <p className="font-bold text-rose-700 text-xl font-mono">{data.psif_priority_reports}</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 space-y-1">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Precursor Density</span>
            <p className="font-bold text-amber-700 text-xl font-mono">{data.psif_density_percent}%</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Dominant Precursor Weak Signal
          </span>
          <p className="text-sm font-bold text-slate-900">
            {data.dominant_precursor}
          </p>
        </div>
      </div>
    </div>
  );
}
