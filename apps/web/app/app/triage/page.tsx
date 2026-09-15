"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Filter, Check, CheckCircle2, AlertTriangle, X, Play, ShieldAlert } from "lucide-react";
import { fetchApi, TriageTask } from "@/lib/api";

export default function TriagePage() {
  const [tasks, setTasks] = useState<TriageTask[]>([]);
  const [sortBy, setSortBy] = useState("psif_desc");
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const loadTasks = () => {
    fetchApi<TriageTask[]>(`/api/v1/triage?status_filter=${statusFilter}&sort_by=${sortBy}`)
      .then((data) => setTasks(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
  }, [sortBy, statusFilter]);

  const handleDecision = async (taskId: string, decision: string, reportUid: string) => {
    try {
      await fetchApi(`/api/v1/triage/${taskId}/decision`, {
        method: "POST",
        body: JSON.stringify({
          decision,
          reason: `HSE Triage sign-off: ${decision}`,
          is_training_feedback: true,
        }),
      });
      setTasks((prev) => prev.filter((t) => t.task_id !== taskId));
      setToast(`Incident ${reportUid} successfully marked as ${decision}. Audit record updated.`);
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  // Operational Action: Batch Verify Top Incidents
  const handleBatchVerify = async () => {
    const pending = tasks.slice(0, 3);
    for (const t of pending) {
      await fetchApi(`/api/v1/triage/${t.task_id}/decision`, {
        method: "POST",
        body: JSON.stringify({
          decision: "CONFIRMED",
          reason: "Batch verified via Triage Queue Operational Command",
          is_training_feedback: true,
        }),
      }).catch(() => {});
    }
    setToast(`Batch verification completed for ${pending.length} priority incidents.`);
    setTimeout(() => setToast(null), 4000);
    loadTasks();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast Notice */}
      {toast && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-3.5 text-sm font-bold text-emerald-900 shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
            <span>{toast}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Balanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              HSE Triage Queue
            </h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
              {tasks.length} {statusFilter === "PENDING" ? "Pending" : "Total"}
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
            Priority safety review queue for human-in-the-loop verification and sign-off
          </p>
        </div>

        {/* Operational Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {tasks.length > 0 && statusFilter === "PENDING" && (
            <button
              onClick={handleBatchVerify}
              className="flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-2 text-xs font-bold text-sky-800 hover:bg-sky-100 transition shadow-xs cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 text-sky-600" />
              <span>Batch Verify</span>
            </button>
          )}

          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
            {[
              { key: "PENDING", label: "Pending" },
              { key: "COMPLETED", label: "Resolved" },
              { key: "ALL", label: "All" },
            ].map((st) => (
              <button
                key={st.key}
                onClick={() => setStatusFilter(st.key)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                  statusFilter === st.key
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold shadow-xs text-slate-700">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-900 focus:outline-none text-xs font-bold cursor-pointer"
            >
              <option value="psif_desc">Highest Risk</option>
              <option value="priority_desc">Priority Score</option>
              <option value="confidence_desc">Confidence</option>
              <option value="date_desc">Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Balanced Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Incident UID</th>
                <th className="px-5 py-3.5">Risk Probability</th>
                <th className="px-5 py-3.5">Critical Barrier</th>
                <th className="px-5 py-3.5">Life-Saving Rule</th>
                <th className="px-5 py-3.5 text-right">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm font-medium">
                    Triage queue is clear. No incidents awaiting verification.
                  </td>
                </tr>
              ) : (
                tasks.map((t) => (
                  <tr key={t.task_id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <Link
                        href={`/app/reports/${t.report_id}`}
                        className="font-mono font-bold text-sm text-slate-900 hover:text-sky-600 transition block"
                      >
                        {t.report_uid}
                      </Link>
                      <div className="text-xs text-slate-500 font-medium truncate max-w-sm mt-0.5">
                        {t.site_name}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 font-mono">
                          {(t.psif_probability * 100).toFixed(0)}% pSIF
                        </span>
                        <span className="text-xs font-semibold text-slate-400 font-mono">
                          Score {t.priority_score}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900 text-xs">{t.primary_barrier}</div>
                      <span className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.barrier_state === "Verified"
                          ? "text-emerald-800 bg-emerald-50 border border-emerald-200"
                          : "text-amber-800 bg-amber-50 border border-amber-200"
                      }`}>
                        {t.barrier_state}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-800 text-xs block">{t.primary_lsr}</span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDecision(t.task_id, "CONFIRMED", t.report_uid)}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-2xs cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleDecision(t.task_id, "ESCALATED", t.report_uid)}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                          Escalate
                        </button>
                        <Link
                          href={`/app/reports/${t.report_id}`}
                          className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition"
                        >
                          Inspect
                        </Link>
                      </div>
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
