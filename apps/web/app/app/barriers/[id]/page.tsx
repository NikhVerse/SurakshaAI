"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function BarrierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const barrierId = resolvedParams.id;
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchApi<any>(`/api/v1/barriers/${barrierId}`)
      .then((res) => setData(res))
      .catch((err) => console.error(err));
  }, [barrierId]);

  if (!data) {
    return (
      <div className="p-10 text-center text-xs font-bold text-slate-400">
        Loading critical barrier intelligence...
      </div>
    );
  }

  const b = data.barrier;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 border-b border-slate-200 pb-3">
        <Link href="/app/barriers" className="hover:text-slate-900 transition flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Barriers</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-mono text-slate-700 font-bold">{b.code}</span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Barrier Code: {b.code}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {b.name}
            </h1>
          </div>
          <span className="self-start sm:self-auto rounded-md bg-sky-50 border border-sky-200 px-3 py-1 text-xs font-bold text-sky-800">
            {b.category || "Critical Barrier"}
          </span>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Expected Safety Function &amp; Baseline Performance
          </span>
          <p className="text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/60 p-4 rounded-xl border border-slate-100">
            {b.expected_function}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Associated Records
            </span>
            <p className="font-black text-slate-900 text-2xl font-mono">{data.total_associated_reports || 0}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Criticality Tier
            </span>
            <p className="font-bold text-rose-700 text-base">{data.criticality || "Tier 1"}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Primary LSR
            </span>
            <p className="font-bold text-slate-900 text-xs sm:text-sm">Energy Isolation</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Audit Status
            </span>
            <p className="font-bold text-emerald-700 text-xs sm:text-sm flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Active</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
