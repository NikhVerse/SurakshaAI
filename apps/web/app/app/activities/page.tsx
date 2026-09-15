"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Activity as ActivityIcon, ArrowRight } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<any[]>("/api/v1/activities")
      .then((data) => setActivities(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Balanced Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Activity &amp; Task Risk Profiles
        </h1>
        <p className="text-sm sm:text-base font-medium text-slate-500 mt-1">
          Hazard exposure patterns and precursor density segmented by industrial work types
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((a) => (
          <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs hover:border-slate-300 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-slate-100 border border-slate-200 px-2.5 py-0.5 font-mono text-xs font-bold text-slate-700">
                  {a.code}
                </span>
                <span className="rounded-md bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-0.5 text-xs font-bold">
                  {a.category}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">{a.name}</h2>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Industrial activity governed by mandatory barrier requirements.
              </p>
              <div className="text-xs text-slate-500 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span>Associated Records</span>
                <span className="text-slate-900 font-bold font-mono text-sm">{a.total_reports}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Activity Scope</span>
              <Link
                href={`/app/activities/${a.id}`}
                className="flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition"
              >
                <span>Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
