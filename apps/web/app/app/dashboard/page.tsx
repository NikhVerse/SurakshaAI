"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  AlertTriangle,
  ShieldCheck,
  Layers,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Plus,
  MapPin,
  ShieldAlert,
  ArrowUpRight,
  XCircle,
  Clock,
  Lock,
  Wind,
  Power,
  FileCheck,
  Gauge,
  Thermometer,
  Flame,
  Radio,
  SlidersHorizontal,
} from "lucide-react";
import { dashboardApi, DashboardSummary } from "@/lib/api";
import DetailDrawer, { DrawerData } from "@/components/ui/DetailDrawer";
import Tooltip from "@/components/ui/Tooltip";
import { StatusDot, RiskScore, SeverityBadge } from "@/components/ui/StatusSystem";
import { LiveValue, Sparkline } from "@/components/ui/VisualGauges";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getSummary();
      setSummary(data);
    } catch (err: any) {
      setError(err.message || "Failed to load operational metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openIncidentDrawer = (item: {
    id: string;
    site: string;
    rule: string;
    risk: number;
    title: string;
    narrative: string;
    barrier: string;
    barrierState: string;
  }) => {
    setDrawerData({
      id: item.id,
      uid: item.id,
      title: item.title,
      severity: item.risk >= 0.8 ? "CRITICAL" : "HIGH",
      status: "PENDING",
      riskScore: item.risk,
      location: item.site,
      timestamp: "2 mins ago",
      narrative: item.narrative,
      rule: item.rule,
      primaryBarrier: item.barrier,
      barrierState: item.barrierState,
      metrics: [
        { label: "Line Pressure", value: 110.4, unit: "Bar" },
        { label: "Vapor Reading", value: 18, unit: "% LEL" },
      ],
      onConfirm: () => {
        // Confirmation feedback
      },
    });
    setDrawerOpen(true);
  };

  const openBarrierDrawer = (barrier: {
    name: string;
    short: string;
    score: number;
    status: string;
    iogp: string;
  }) => {
    setDrawerData({
      id: barrier.short,
      uid: barrier.iogp,
      title: barrier.name,
      severity: barrier.status,
      status: barrier.status,
      riskScore: 1 - barrier.score / 100,
      location: "Active across 5 installations",
      timestamp: "Inspected 12m ago",
      narrative: `IOGP 459 standard defense barrier: ${barrier.name}. Current verified defense capacity is ${barrier.score}%. Continuous monitoring in effect across all shift permits.`,
      primaryBarrier: barrier.name,
      barrierState: barrier.status === "VERIFIED" ? "Verified" : "Degraded",
      metrics: [
        { label: "Verified Skids", value: 28, unit: "Units" },
        { label: "Inspection Pass", value: `${barrier.score}%`, unit: "" },
      ],
    });
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6 pb-20 font-sans">
      {/* Universal Detail Drawer */}
      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data={drawerData}
      />

      {/* Header — Compact 1-2 word labels */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Command Center
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Realtime SIF triage, barrier integrity matrix &amp; live telemetry
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            title="Sync telemetry"
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-slate-900" : ""}`} strokeWidth={1.8} />
          </button>
          <Link
            href="/app/triage"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-xs"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" strokeWidth={2} />
            <span>Triage Queue</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-800">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 09. TOP: 5-Card Number-First KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Critical */}
        <div className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/20 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
              Critical
            </span>
            <StatusDot status="CRITICAL" pulse size="sm" />
          </div>
          <span className="text-3xl font-black font-mono text-rose-600 tracking-tight mt-1.5">
            08
          </span>
          <span className="text-[10px] font-bold text-rose-600/90 mt-1">
            pSIF ≥ 0.70
          </span>
        </div>

        {/* High Precursor Signals */}
        <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/20 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
              High Risk
            </span>
            <StatusDot status="HIGH" size="sm" />
          </div>
          <span className="text-3xl font-black font-mono text-amber-600 tracking-tight mt-1.5">
            14
          </span>
          <span className="text-[10px] font-bold text-amber-700 mt-1">
            Precursor Signals
          </span>
        </div>

        {/* Open Actions */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Open Actions
            </span>
            <StatusDot status="NEUTRAL" size="sm" />
          </div>
          <span className="text-3xl font-black font-mono text-slate-900 tracking-tight mt-1.5">
            06
          </span>
          <span className="text-[10px] font-bold text-slate-500 mt-1">
            Pending Sign-Off
          </span>
        </div>

        {/* Barrier Health Index */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Barrier
            </span>
            <StatusDot status="HEALTHY" size="sm" />
          </div>
          <span className="text-3xl font-black font-mono text-emerald-600 tracking-tight mt-1.5">
            88.4%
          </span>
          <span className="text-[10px] font-bold text-emerald-700 mt-1">
            18 IOGP Active
          </span>
        </div>

        {/* Live Monitored Assets */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Live Assets
            </span>
            <StatusDot status="ONLINE" pulse size="sm" />
          </div>
          <span className="text-3xl font-black font-mono text-slate-900 tracking-tight mt-1.5">
            05
          </span>
          <span className="text-[10px] font-bold text-slate-500 mt-1">
            Indian Hydrocarbon
          </span>
        </div>
      </div>

      {/* 09. MAIN: Left (Critical Incidents) & Right (Barrier Health) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Critical Precursor Incident Queue (Level 1 visual cards) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Critical SIF Incidents
              </h2>
            </div>
            <Link
              href="/app/triage"
              className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition"
            >
              <span>View All (8)</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {[
              {
                id: "REP-MUM-001",
                site: "Mumbai High",
                rule: "Isolation Bypass",
                risk: 0.88,
                title: "Gas Release",
                narrative:
                  "Hydrocarbon vapor release during flare knockout drum bypass without gas test confirmation.",
                barrier: "Positive Isolation DBB",
                barrierState: "Failed",
              },
              {
                id: "REP-ASM-004",
                site: "Digboi Asset",
                rule: "Energy Isolation",
                risk: 0.82,
                title: "Manifold Weep",
                narrative:
                  "Wellhead crude transfer manifold packing failure with unverified isolation boundary.",
                barrier: "Isolation Boundary",
                barrierState: "Degraded",
              },
              {
                id: "REP-GUJ-007",
                site: "Hazira Terminal",
                rule: "Hot Work Control",
                risk: 0.76,
                title: "Vapor Ignition",
                narrative:
                  "Welding torch ignition near LPG condensate drain line; spark containment screen degraded.",
                barrier: "Continuous Gas Sniffing",
                barrierState: "Absent",
              },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => openIncidentDrawer(item)}
                className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition cursor-pointer flex items-center justify-between gap-3 group shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <RiskScore score={item.risk} />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {item.id}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{item.site}</span>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600 font-semibold truncate">
                        {item.rule}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-0.5">
                    Review
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Visual Barrier Matrix (Icons + Short Labels + Progress Bars) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Barrier Matrix
              </h2>
            </div>
            <Link
              href="/app/barriers"
              className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition"
            >
              <span>Matrix</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              {
                icon: Lock,
                short: "Isolation",
                name: "Physical Isolation (Double Block & Bleed)",
                score: 92,
                status: "VERIFIED",
                iogp: "BAR-ENG-01",
              },
              {
                icon: Flame,
                short: "Ignition",
                name: "Hazardous Area Ignition Control (Ex-Rated)",
                score: 85,
                status: "DEGRADED",
                iogp: "BAR-PHYS-02",
              },
              {
                icon: FileCheck,
                short: "Permit",
                name: "Permit to Work (PTW) Cross-Signoff",
                score: 71,
                status: "FAILED",
                iogp: "BAR-PROC-03",
              },
              {
                icon: Wind,
                short: "Detection",
                name: "Combustible & Toxic Gas Detection (LEL)",
                score: 96,
                status: "VERIFIED",
                iogp: "BAR-ENG-04",
              },
              {
                icon: Power,
                short: "Shutdown",
                name: "Emergency Shutdown (ESD Valve Seal)",
                score: 89,
                status: "VERIFIED",
                iogp: "BAR-ENG-05",
              },
            ].map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.short}
                  onClick={() => openBarrierDrawer(b)}
                  className="space-y-1.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <Tooltip content={`${b.name} (${b.iogp})`}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-slate-600 shrink-0" strokeWidth={1.8} />
                        <span className="font-bold text-slate-800">{b.short}</span>
                      </div>
                    </Tooltip>

                    <div className="flex items-center gap-2 font-mono">
                      <span
                        className={`text-xs font-black ${
                          b.status === "VERIFIED"
                            ? "text-emerald-600"
                            : b.status === "DEGRADED"
                            ? "text-amber-600"
                            : "text-rose-600"
                        }`}
                      >
                        {b.score}%
                      </span>
                      <StatusDot status={b.status} size="sm" />
                    </div>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        b.status === "VERIFIED"
                          ? "bg-emerald-500"
                          : b.status === "DEGRADED"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${b.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 09. BOTTOM: Live Data Telemetry Stream (No paragraphs, pure signal) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Field Telemetry Stream
            </h2>
          </div>
          <Link
            href="/app/data-feed"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
          >
            <span>Full Stream</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <LiveValue
            label="GLM-04 Pressure"
            value="110.4"
            unit="Bar"
            trend={+2.4}
            status="CRITICAL"
          />
          <LiveValue
            label="Reboiler Temp"
            value="148.2"
            unit="°C"
            trend={-0.8}
            status="HEALTHY"
          />
          <LiveValue
            label="Trench Gas (LEL)"
            value="2.4"
            unit="% LEL"
            trend={+0.4}
            status="DEGRADED"
          />
          <LiveValue
            label="ESD Valve Seal"
            value="99.8"
            unit="%"
            status="HEALTHY"
          />
        </div>
      </div>
    </div>
  );
}
