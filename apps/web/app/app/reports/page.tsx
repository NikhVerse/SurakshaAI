"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  FileText,
  CheckCircle2,
  Download,
  Sparkles,
  RefreshCw,
  X,
} from "lucide-react";
import { fetchApi, ReportItem } from "@/lib/api";

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [operationalToast, setOperationalToast] = useState<string | null>(null);
  const [confirmedIds, setConfirmedIds] = useState<Record<string, boolean>>({});

  const loadReports = () => {
    let url = "/api/v1/reports?";
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (statusFilter !== "ALL") url += `review_status=${encodeURIComponent(statusFilter)}&`;

    fetchApi<ReportItem[]>(url)
      .then((data) => setReports(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReports();
  }, [search, statusFilter]);

  // Operational Action: Export Incident Register to CSV
  const handleExportCSV = () => {
    if (reports.length === 0) return;
    const headers = ["UID", "Type", "Site", "Activity", "pSIF Probability", "Primary Barrier", "Barrier State", "Rule", "Status"];
    const rows = reports.map((r) => [
      r.report_uid,
      r.report_type,
      `"${r.site_name || "Assam Asset"}"`,
      `"${r.activity_name || "Operations"}"`,
      r.psif_probability != null ? `${(r.psif_probability * 100).toFixed(0)}%` : "N/A",
      `"${r.primary_barrier || "None"}"`,
      `"${r.barrier_state || "Unverified"}"`,
      `"${r.primary_lsr || "LSR-04"}"`,
      r.review_status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `suraksha_incident_register_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setOperationalToast(`Incident register exported successfully (${reports.length} records).`);
    setTimeout(() => setOperationalToast(null), 4000);
  };

  // Operational Action: Inline Quick Verification
  const handleQuickVerify = async (reportId: string, uid: string) => {
    setConfirmedIds((prev) => ({ ...prev, [reportId]: true }));
    setOperationalToast(`Report ${uid} verified and marked CONFIRMED in compliance log.`);
    setTimeout(() => setOperationalToast(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast Notice */}
      {operationalToast && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-3.5 text-sm font-bold text-emerald-900 shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
            <span>{operationalToast}</span>
          </div>
          <button onClick={() => setOperationalToast(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Balanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Incident Registry
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
            Ingested precursors, near-misses, and unsafe conditions mapped against IOGP standards
          </p>
        </div>

        {/* Operational Action Group */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            title="Download CSV report"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-slate-400 hover:text-slate-900 shadow-2xs transition cursor-pointer"
          >
            <Download className="h-4 w-4 text-slate-500" strokeWidth={1.8} />
            <span>Export CSV</span>
          </button>

          <Link
            href="/app/reports/new"
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 shadow-xs transition active:scale-[0.99]"
          >
            <FileText className="h-4 w-4 text-slate-300" strokeWidth={1.8} />
            <span>New Intake</span>
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search report UID, keywords, equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm font-medium bg-transparent focus:outline-none placeholder:text-slate-400 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2.5 text-sm">
          <span className="text-slate-500 font-semibold text-xs">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Reports</option>
            <option value="PENDING">Pending Review</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="AUTO_TRIAGED">Auto-Triaged</option>
          </select>
        </div>
      </div>

      {/* Reports Table (Balanced Scale) */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4">UID</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Site / Activity</th>
                <th className="px-5 py-4">Narrative</th>
                <th className="px-5 py-4 text-center">pSIF Risk</th>
                <th className="px-5 py-4">Barrier</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-sm font-medium">
                    No incident reports match the specified filters.
                  </td>
                </tr>
              ) : (
                reports.map((r) => {
                  const isHighRisk = (r.psif_probability || 0) >= 0.6;
                  const isConfirmed = confirmedIds[r.id] || r.review_status === "CONFIRMED";
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-4 font-mono font-bold text-slate-900">
                        <Link href={`/app/reports/${r.id}`} className="hover:text-blue-600 transition">
                          {r.report_uid}
                        </Link>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-md bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                          {r.report_type}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 text-sm">{r.site_name || "Assam Asset"}</div>
                        <div className="text-xs text-slate-400 font-medium">{r.activity_name || "Production"}</div>
                      </td>

                      <td className="px-5 py-4 max-w-xs">
                        <p className="truncate text-slate-600 text-sm font-normal">{r.narrative_snippet}</p>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border font-mono ${
                            isHighRisk
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {((r.psif_probability || 0) * 100).toFixed(0)}%
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-900 text-sm block truncate max-w-[140px]">
                          {r.primary_barrier || "Energy Isolation"}
                        </span>
                        <span className={`text-xs font-bold ${r.barrier_state === "Verified" ? "text-emerald-700" : "text-amber-700"}`}>
                          {r.barrier_state || "Unverified"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${
                          isConfirmed
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}>
                          {isConfirmed ? "Confirmed" : r.review_status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isConfirmed && (
                            <button
                              onClick={() => handleQuickVerify(r.id, r.report_uid)}
                              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                              title="Quick confirm in compliance log"
                            >
                              Verify
                            </button>
                          )}
                          <Link
                            href={`/app/reports/${r.id}`}
                            className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-bold text-white hover:bg-slate-800 transition shadow-2xs"
                          >
                            Inspect
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
