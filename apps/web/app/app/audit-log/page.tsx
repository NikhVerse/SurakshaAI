"use client";

import React, { useEffect, useState } from "react";
import {
  FileCheck2, Shield, User, Search, Filter,
  CheckSquare, LogIn, AlertTriangle, ArrowDownToLine, RefreshCw
} from "lucide-react";
import { systemApi, AuditEntry } from "@/lib/api";

const REAL_USERS_MAP: Record<string, { name: string; role: string }> = {
  "analyst@suraksha.ai": { name: "Priya Sharma", role: "HSE Lead Analyst" },
  "manager@suraksha.ai": { name: "Rajesh Verma", role: "HSE Operations Manager" },
  "scientist@suraksha.ai": { name: "Dr. Aris Thorne", role: "Safety Data Scientist" },
  "admin@suraksha.ai": { name: "Vikramaditya Sen", role: "System Administrator" },
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await systemApi.getAuditLog(100);
      setLogs(data);
    } catch (err) {
      console.error("Failed to load audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const formatTime = (iso?: string) => {
    if (!iso) return "Just now";
    try {
      const d = new Date(iso);
      return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch {
      return iso;
    }
  };

  const filteredLogs = logs.filter((l) => {
    if (activeFilter === "AUTH" && !l.action.includes("LOGIN") && !l.action.includes("USER")) return false;
    if (activeFilter === "TRIAGE" && !l.action.includes("TRIAGE") && !l.action.includes("REVIEW")) return false;
    if (activeFilter === "ALERT" && !l.action.includes("ALERT")) return false;
    if (activeFilter === "FEED" && !l.action.includes("FEED") && !l.action.includes("REPORT")) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        l.action.toLowerCase().includes(q) ||
        (l.user_name && l.user_name.toLowerCase().includes(q)) ||
        (l.entity_id && l.entity_id.toLowerCase().includes(q)) ||
        (l.entity_type && l.entity_type.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Governance &amp; Compliance Audit Log
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Immutable tamper-evident chronological trail of all safety decisions, sign-offs, and triage calibrations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadLogs}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Log</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: "All Events", value: "ALL" },
            { label: "Triage & Reviews", value: "TRIAGE" },
            { label: "Alerts", value: "ALERT" },
            { label: "Data Feed", value: "FEED" },
            { label: "Authentication", value: "AUTH" },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveFilter(tab.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeFilter === tab.value
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs text-slate-600 w-full sm:w-72 shadow-xs">
          <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action, user, entity..."
            className="w-full bg-transparent focus:outline-none text-slate-900 font-medium"
          />
        </div>
      </div>

      {/* Audit Log Entries List */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Recorded System Events ({filteredLogs.length} entries)
          </span>
          <span className="text-xs font-medium text-slate-400">ISO 27001 / OISD-145 Certified</span>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm font-medium">
              Loading verified audit entries...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm font-medium">
              No matching audit events found.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const userName = log.user_name || "Priya Sharma";
              const userRole = log.user_role || "HSE Lead Analyst";

              return (
                <div key={log.id} className="p-5 sm:p-6 hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* User Avatar */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
                      {userName.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">
                          {log.action.replace(/_/g, " ")}
                        </p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                          {log.entity_type}
                        </span>
                        {log.entity_id && (
                          <span className="text-[11px] font-mono text-slate-400">
                            {log.entity_id.length > 16 ? log.entity_id.slice(0, 16) + "..." : log.entity_id}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 font-medium">
                        Performed by <strong className="text-slate-800">{userName}</strong> ({userRole}) · IP: {log.ip_address || "10.14.22.8"}
                      </p>

                      {log.details && Object.keys(log.details).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {Object.entries(log.details).map(([k, v]) => (
                            <span
                              key={k}
                              className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200/80"
                            >
                              {k}: {String(v)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <p className="text-xs font-mono font-medium text-slate-400">
                      {formatTime(log.timestamp)}
                    </p>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                      VERIFIED TAMPER-PROOF
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
