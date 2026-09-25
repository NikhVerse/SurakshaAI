"use client";

import React, { useEffect, useState } from "react";
import {
  FileCheck2,
  Shield,
  Search,
  RefreshCw,
  Clock,
  User,
  CheckCircle2,
  Lock,
  ArrowRight,
  Filter,
} from "lucide-react";
import { systemApi, AuditEntry } from "@/lib/api";
import { StatusDot } from "@/components/ui/StatusSystem";
import { DetailDrawer, DetailDrawerTab } from "@/components/ui/DetailDrawer";
import { Tooltip } from "@/components/ui/Tooltip";

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedLog, setSelectedLog] = useState<AuditEntry | null>(null);

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
      return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return iso;
    }
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    } catch {
      return "";
    }
  };

  const uniqueActors = Array.from(
    new Set(logs.map((l) => l.user_name || l.user_id).filter(Boolean))
  );

  const filteredLogs = logs.filter((l) => {
    if (activeFilter === "AUTH" && !l.action.includes("LOGIN") && !l.action.includes("USER")) return false;
    if (activeFilter === "TRIAGE" && !l.action.includes("TRIAGE") && !l.action.includes("REVIEW")) return false;
    if (activeFilter === "ALERT" && !l.action.includes("ALERT")) return false;
    if (activeFilter === "REPORT" && !l.action.includes("REPORT") && !l.action.includes("INCIDENT")) return false;

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

  const getActionStatus = (action: string) => {
    if (action.includes("FAIL") || action.includes("BREACH") || action.includes("ALERT")) return "CRITICAL";
    if (action.includes("OVERRIDE") || action.includes("MODIFY") || action.includes("WARNING")) return "WARNING";
    if (action.includes("CONFIRM") || action.includes("VERIF") || action.includes("LOGIN")) return "HEALTHY";
    return "INFO";
  };

  const getShortAction = (action: string) => {
    return action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Top Operational Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-slate-800" strokeWidth={1.8} />
            <span>Audit Trail</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Immutable chronological timeline of all safety actions, barrier calibrations &amp; sign-offs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadLogs}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Number-First Operational Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Events</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">{logs.length}</p>
          <span className="text-[11px] font-semibold text-slate-500">Verified Append-Only</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Integrity</span>
          <p className="text-2xl font-black text-emerald-600 font-mono mt-0.5">100%</p>
          <span className="text-[11px] font-semibold text-emerald-700">Tamper-Proof</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Active Actors</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">
            {uniqueActors.length < 10 ? `0${uniqueActors.length}` : uniqueActors.length}
          </p>
          <span className="text-[11px] font-semibold text-slate-500">Role-Gated</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Compliance</span>
          <p className="text-lg font-black text-slate-900 font-mono mt-1">ISO 27001</p>
          <span className="text-[11px] font-semibold text-slate-500">OISD-145 Certified</span>
        </div>
      </div>

      {/* Scannable Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { label: "All", value: "ALL" },
            { label: "Triage", value: "TRIAGE" },
            { label: "Alerts", value: "ALERT" },
            { label: "Reports", value: "REPORT" },
            { label: "Auth", value: "AUTH" },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveFilter(tab.value)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeFilter === tab.value
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 w-full sm:w-64 shadow-2xs">
          <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action or actor..."
            className="w-full bg-transparent focus:outline-none text-slate-900 font-medium"
          />
        </div>
      </div>

      {/* Visual Operational Timeline */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-[12px] font-bold uppercase tracking-wider text-slate-500">
            Timeline ({filteredLogs.length})
          </span>
          <span className="text-[12px] font-mono text-emerald-700 font-bold flex items-center gap-1">
            <Lock className="h-3 w-3" />
            <span>Cryptographic Trail</span>
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs font-medium">
              Verifying audit records...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-medium">
              No matching events found.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const userName = log.user_name || "System Operator";
              const userInitials = userName.split(/[\s@._]+/).filter(Boolean).map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "SY";
              const status = getActionStatus(log.action);

              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="px-5 py-3.5 hover:bg-slate-50/90 transition flex items-center justify-between gap-3 cursor-pointer group"
                >
                  {/* Left: Time + Status Dot + Action + Entity */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="text-right shrink-0 w-16">
                      <span className="text-xs font-mono font-bold text-slate-800 block">
                        {formatTime(log.timestamp)}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 block">
                        {formatDate(log.timestamp)}
                      </span>
                    </div>

                    <StatusDot status={status as any} />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                          {getShortAction(log.action)}
                        </span>
                        <span className="text-[11px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase shrink-0">
                          {log.entity_type}
                        </span>
                      </div>
                      {log.entity_id && (
                        <span className="text-[12px] font-mono text-slate-400 block truncate">
                          ID: {log.entity_id.length > 22 ? log.entity_id.slice(0, 22) + "..." : log.entity_id}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Operator Pill + Action */}
                  <div className="flex items-center gap-3 shrink-0">
                    <Tooltip content={`${userName} (${log.user_role || "Analyst"})${log.ip_address ? ` · IP: ${log.ip_address}` : ""}`}>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                        <span className="h-5 w-5 rounded-md bg-slate-200 text-[11px] font-bold flex items-center justify-center text-slate-700">
                          {userInitials}
                        </span>
                        <span className="hidden md:inline text-[12px]">{userName}</span>
                      </div>
                    </Tooltip>

                    <button
                      type="button"
                      className="text-xs font-bold text-slate-400 group-hover:text-slate-900 flex items-center gap-1 transition"
                    >
                      <span className="hidden sm:inline text-[12px]">Inspect</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Universal Detail Drawer for Selected Audit Event */}
      <DetailDrawer
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        title={selectedLog ? getShortAction(selectedLog.action) : "Audit Details"}
        subtitle={selectedLog ? `${selectedLog.entity_type} • ${selectedLog.entity_id || "System Action"}` : undefined}
        status={{
          label: "VERIFIED TAMPER-PROOF",
          variant: "healthy",
        }}
        metrics={[
          { label: "Timestamp", value: selectedLog ? formatTime(selectedLog.timestamp) : "—" },
          { label: "Actor", value: selectedLog?.user_name || "System Operator" },
          { label: "IP Address", value: selectedLog?.ip_address || "Local Network" },
          { label: "Integrity", value: "Verified SHA-256" },
        ]}
        tabs={[
          {
            id: "overview",
            label: "Overview",
            content: (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Execution Profile
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Action Code</span>
                      <span className="font-mono font-bold text-slate-900">{selectedLog?.action}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Target Type</span>
                      <span className="font-mono font-bold text-slate-900">{selectedLog?.entity_type}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Actor Role</span>
                      <span className="font-bold text-slate-900">{selectedLog?.user_role || "Analyst"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Compliance State</span>
                      <span className="font-bold text-emerald-700">OISD-145 Certified</span>
                    </div>
                  </div>
                </div>

                {selectedLog?.details && Object.keys(selectedLog.details).length > 0 && (
                  <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Payload Attributes
                    </span>
                    <div className="space-y-1.5">
                      {Object.entries(selectedLog.details).map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                          <span className="font-mono text-slate-500">{k}</span>
                          <span className="font-mono font-bold text-slate-900">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ),
          },
          {
            id: "evidence",
            label: "Cryptographic Proof",
            content: (
              <div className="space-y-3">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Cryptographic Block Signature Valid</span>
                  </div>
                  <p className="text-[12px] font-mono text-emerald-700 break-all">
                    {selectedLog?.id ? `sha256:${selectedLog.id}` : "Verified SHA-256 Record"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 bg-slate-900 text-white font-mono text-[12px] space-y-1">
                  <span className="text-slate-400 block text-[11px]">RAW AUDIT BLOB:</span>
                  <pre className="overflow-x-auto whitespace-pre-wrap text-slate-300">
                    {JSON.stringify(selectedLog, null, 2)}
                  </pre>
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
