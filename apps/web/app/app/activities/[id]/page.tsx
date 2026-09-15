"use client";

import React, { use } from "react";
import Link from "next/link";
import { ChevronRight, Activity, ArrowLeft } from "lucide-react";

export default function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const activityId = resolvedParams.id;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 border-b border-slate-200 pb-3">
        <Link href="/app/activities" className="hover:text-slate-900 transition flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>All Activities</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-mono text-slate-700">{activityId}</span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 block">
            Activity Risk Profile
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">High-Hazard Work Profile</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Industrial work activity governed by mandatory barrier verification, permits to work, and energy isolation requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Associated Records</span>
            <p className="font-bold text-slate-900 text-xl font-mono">7</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Primary Hazard</span>
            <p className="font-bold text-slate-900 text-base">Mechanical Energy</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mandatory Control</span>
            <p className="font-bold text-sky-700 text-base">Energy Isolation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
