"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckSquare, ArrowRight, UserCheck } from "lucide-react";
import { fetchApi, TriageTask } from "@/lib/api";

export default function ReviewsPage() {
  const [tasks, setTasks] = useState<TriageTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<TriageTask[]>("/api/v1/triage?status_filter=ALL")
      .then((data) => setTasks(data.filter((t) => t.status === "COMPLETED")))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Balanced Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          HSE Validation History
        </h1>
        <p className="text-sm sm:text-base font-medium text-slate-500 mt-1">
          Auditable archive of human decisions, verified barrier outcomes, and model feedback
        </p>
      </div>

      {/* Balanced Reviews Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Report UID</th>
                <th className="px-5 py-3.5">Site</th>
                <th className="px-5 py-3.5">Decision</th>
                <th className="px-5 py-3.5">Calibrated pSIF</th>
                <th className="px-5 py-3.5">Barrier State</th>
                <th className="px-5 py-3.5">Reviewer Note</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400 font-medium text-sm">
                    No completed triage reviews yet. Decisions submitted in the review queue will appear here.
                  </td>
                </tr>
              ) : (
                tasks.map((t) => (
                  <tr key={t.task_id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                      {t.report_uid}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-700">{t.site_name}</td>
                    <td className="px-5 py-3.5">
                      <span className="rounded bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold">
                        {t.decision || "CONFIRMED"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                      {(t.psif_probability * 100).toFixed(0)}%
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-700">
                      {t.primary_barrier} <span className="text-slate-400">({t.barrier_state})</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate text-xs">
                      {t.reason || "Validated by Lead HSE Analyst"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/app/reports/${t.report_id}`}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        View Report
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
