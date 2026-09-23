"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  FileText,
  MapPin,
  ArrowRight,
  SlidersHorizontal,
  X,
  AlertTriangle,
  Lock,
  Wind,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { fetchApi, ReportItem } from "@/lib/api";
import DetailDrawer, { DrawerData } from "@/components/ui/DetailDrawer";
import Tooltip from "@/components/ui/Tooltip";
import { StatusDot, RiskScore } from "@/components/ui/StatusSystem";

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // Detail Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null);

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

  const handleExportCSV = () => {
    if (reports.length === 0) return;
    const headers = ["UID", "Type", "Site", "Activity", "pSIF", "Barrier", "Status"];
    const rows = reports.map((r) => [
      r.report_uid,
      r.report_type,
      `"${r.site_name || "Assam Asset"}"`,
      `"${r.activity_name || "Operations"}"`,
      r.psif_probability != null ? `${(r.psif_probability * 100).toFixed(0)}%` : "N/A",
      `"${r.primary_barrier || "None"}"`,
      r.review_status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `suraksha_incidents_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openDrawer = (r: ReportItem) => {
    setDrawerData({
      id: r.id,
      uid: r.report_uid,
      title: `${r.report_type.replace(/_/g, " ")}: ${r.site_name || "Installation"}`,
      severity: (r.psif_probability || 0) >= 0.7 ? "CRITICAL" : "HIGH",
      status: r.review_status,
      riskScore: r.psif_probability || 0.75,
      location: r.site_name,
      timestamp: r.date_time ? new Date(r.date_time).toLocaleDateString() : "Recent",
      narrative: r.narrative_snippet || "Precursor incident requiring operational review.",
      primaryBarrier: r.primary_barrier,
      barrierState: r.barrier_state,
      rule: r.primary_lsr || "IOGP Standard",
      metrics: [
        { label: "pSIF Priority", value: `${((r.psif_probability || 0) * 100).toFixed(0)}%` },
        { label: "Barrier Status", value: r.barrier_state || "Unverified" },
      ],
      onConfirm: () => {
        // Confirm action
      },
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
            Incidents
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Precursor signals, near-misses &amp; operational barrier verification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            title="Export CSV"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <Link
            href="/app/reports/new"
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition shadow-xs"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Intake</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex items-center justify-between gap-3 p-2 rounded-xl border border-slate-200 bg-white shadow-2xs">
        <div className="flex items-center gap-2 flex-1 px-2">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Filter UID, site, equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-medium bg-transparent focus:outline-none placeholder:text-slate-400 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0 pr-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
            Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All ({reports.length})</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
          </select>
        </div>
      </div>

      {/* High-Density Visual Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">UID</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Asset</th>
                <th className="px-4 py-3 text-center">Risk</th>
                <th className="px-4 py-3">Barrier</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs font-medium">
                    No incidents matching filter.
                  </td>
                </tr>
              ) : (
                reports.map((r) => {
                  return (
                    <tr
                      key={r.id}
                      onClick={() => openDrawer(r)}
                      className="hover:bg-slate-50 transition cursor-pointer group"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {r.report_uid}
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/80">
                          {r.report_type.replace(/_/g, " ")}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 font-bold text-slate-900 text-xs">
                          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[160px]">{r.site_name || "Installation"}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <RiskScore score={r.psif_probability || 0.65} size="sm" />
                      </td>

                      <td className="px-4 py-3">
                        <Tooltip content={r.primary_barrier || "Engineered Barrier"}>
                          <span className="font-semibold text-slate-800 text-xs truncate max-w-[130px] block">
                            {r.primary_barrier || "Isolation"}
                          </span>
                        </Tooltip>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <StatusDot
                            status={r.barrier_state === "Verified" ? "HEALTHY" : "CRITICAL"}
                            size="sm"
                          />
                          <span className="text-xs font-mono font-bold text-slate-600">
                            {r.barrier_state || "Unverified"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center justify-end gap-1">
                          Inspect
                          <ArrowRight className="h-3 w-3" />
                        </span>
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
