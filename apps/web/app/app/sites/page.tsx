"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight, ShieldAlert } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function SitesPage() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<any[]>("/api/v1/sites")
      .then((data) => setSites(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Balanced Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Site &amp; Asset Intelligence
        </h1>
        <p className="text-sm sm:text-base font-medium text-slate-500 mt-1">
          Evaluating critical precursor density and barrier health across operational complexes
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {sites.map((s) => (
          <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs hover:border-slate-300 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-slate-100 border border-slate-200 px-2.5 py-0.5 font-mono text-xs font-bold text-slate-700">
                  {s.code}
                </span>
                <span className={`rounded-md px-2.5 py-0.5 text-xs font-bold border ${
                  s.risk_level === "CRITICAL"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : s.risk_level === "HIGH"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-slate-100 text-slate-700 border-slate-200"
                }`}>
                  Tier: {s.risk_level}
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">{s.name}</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{s.location} &bull; {s.operational_unit}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-center">
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reports</span>
                  <span className="text-lg font-bold text-slate-900 mt-0.5 block">{s.total_reports}</span>
                </div>
                <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3">
                  <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">pSIF Signals</span>
                  <span className="text-lg font-bold text-rose-700 mt-0.5 block">{s.psif_priority_reports}</span>
                </div>
                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Precursors</span>
                  <span className="text-lg font-bold text-amber-700 mt-0.5 block">{s.psif_density_percent}%</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Operational Complex</span>
              <Link
                href={`/app/sites/${s.id}`}
                className="flex items-center gap-1.5 font-bold text-sky-700 hover:text-sky-900 transition"
              >
                <span>Site Intelligence</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
