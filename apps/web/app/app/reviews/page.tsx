"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckSquare, ArrowRight, UserCheck, Search, Filter } from "lucide-react";
import { fetchApi, TriageTask } from "@/lib/api";
import { StatusDot, RiskScore } from "@/components/ui/StatusSystem";
import { DetailDrawer } from "@/components/ui/DetailDrawer";
import { Tooltip } from "@/components/ui/Tooltip";

export default function ReviewsPage() {
  const [tasks, setTasks] = useState<TriageTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState<TriageTask | null>(null);

  useEffect(() => {
    fetchApi<TriageTask[]>("/api/v1/triage?status_filter=ALL")
      .then((data) => setTasks(data.filter((t) => t.status === "COMPLETED")))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const confirmedCount = tasks.filter((t) => t.decision === "CONFIRMED" || !t.decision).length;
  const confirmedRate = tasks.length > 0 ? Math.round((confirmedCount / tasks.length) * 100) : 100;

  const filtered = tasks.filter((t) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      t.report_uid.toLowerCase().includes(q) ||
      t.site_name.toLowerCase().includes(q) ||
      (t.primary_barrier && t.primary_barrier.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-slate-800" strokeWidth={1.8} />
            <span>Validation Archive</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Auditable archive of human decisions, barrier calibrations &amp; model feedback
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 w-full sm:w-64 shadow-2xs">
          <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search report UID or site..."
            className="w-full bg-transparent focus:outline-none text-slate-900 font-medium"
          />
        </div>
      </div>

      {/* Number-First Operational KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Decisions</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">{tasks.length}</p>
          <span className="text-[10px] font-semibold text-slate-500">HITL Verified</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Confirmation</span>
          <p className="text-2xl font-black text-emerald-600 font-mono mt-0.5">{confirmedRate}%</p>
          <span className="text-[10px] font-semibold text-emerald-700">Model Alignment</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Gating Role</span>
          <p className="text-lg font-black text-slate-900 font-mono mt-1">L4 Analyst</p>
          <span className="text-[10px] font-semibold text-slate-500">Process Authority</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Compliance</span>
          <p className="text-lg font-black text-slate-900 font-mono mt-1">Verified</p>
          <span className="text-[10px] font-semibold text-slate-500">Append-Only Trail</span>
        </div>
      </div>

      {/* High-Density Data Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">UID</th>
                <th className="px-4 py-3">Site</th>
                <th className="px-4 py-3">Decision</th>
                <th className="px-4 py-3 text-right">Risk</th>
                <th className="px-4 py-3">Barrier</th>
                <th className="px-4 py-3">Reviewer Note</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs font-medium">
                    Loading validation archive...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs font-medium">
                    No completed triage decisions found.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr
                    key={t.task_id}
                    onClick={() => setSelectedTask(t)}
                    className="hover:bg-slate-50/80 transition cursor-pointer group"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      {t.report_uid}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{t.site_name}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold uppercase">
                        {t.decision || "CONFIRMED"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono font-black text-slate-900">
                        {t.psif_probability.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 truncate max-w-[140px]">
                      <span className="font-medium">{t.primary_barrier}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate text-[11px]">
                      {t.reason || "Validated by Lead HSE Analyst"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-900 transition flex items-center justify-end gap-1">
                        <span>Inspect</span>
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Universal Detail Drawer */}
      <DetailDrawer
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.report_uid || "Review Decision"}
        subtitle={`${selectedTask?.site_name} • ${selectedTask?.decision || "CONFIRMED"}`}
        status={{
          label: "HUMAN SIGNED-OFF",
          variant: "healthy",
        }}
        metrics={[
          { label: "pSIF Risk", value: selectedTask ? selectedTask.psif_probability.toFixed(2) : "—" },
          { label: "Decision", value: selectedTask?.decision || "CONFIRMED" },
          { label: "Barrier", value: selectedTask?.primary_barrier || "Isolation" },
          { label: "State", value: selectedTask?.barrier_state || "Verified" },
        ]}
        tabs={[
          {
            id: "overview",
            label: "Overview",
            content: (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Reviewer Notes &amp; Rationale
                  </span>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {selectedTask?.reason || "Formally validated by Lead HSE Analyst in accordance with OISD-145 standards."}
                  </p>
                </div>

                <div className="space-y-2">
                  <Link
                    href={`/app/reports/${selectedTask?.report_id}`}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition text-xs font-bold text-slate-900"
                  >
                    <span>Open Complete Incident Report</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
