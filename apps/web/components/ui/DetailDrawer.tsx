"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  ShieldAlert,
  Clock,
  MapPin,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  Calendar,
  User,
  Shield,
  Layers,
} from "lucide-react";
import { StatusDot, SeverityBadge, RiskScore } from "./StatusSystem";

export interface EvidenceItem {
  url: string;
  title: string;
  caption?: string;
  timestamp?: string;
  assetId?: string;
  tag?: string;
}

export interface ExternalSource {
  name: string;
  url: string;
  authority: string;
  code?: string;
}

export interface DrawerData {
  id: string;
  uid?: string;
  title: string;
  category?: string;
  status?: string;
  severity?: string;
  riskScore?: number;
  location?: string;
  asset?: string;
  timestamp?: string;
  narrative?: string;
  rule?: string;
  primaryBarrier?: string;
  barrierState?: string;
  metrics?: Array<{ label: string; value: string | number; unit?: string }>;
  evidenceImages?: EvidenceItem[];
  externalSources?: ExternalSource[];
  timeline?: Array<{ time: string; event: string; status?: string }>;
  onConfirm?: () => void;
  onDismiss?: () => void;
}

export interface DetailDrawerTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  // Structured Data format
  data?: DrawerData | null;
  // Direct props format
  title?: string;
  subtitle?: string;
  status?: { label: string; variant?: "critical" | "high" | "warning" | "healthy" | "info" | "neutral" } | string;
  metrics?: Array<{ label: string; value: string | number; unit?: string }>;
  tabs?: DetailDrawerTab[];
  children?: React.ReactNode;
}

export function DetailDrawer({
  isOpen,
  onClose,
  data,
  title,
  subtitle,
  status,
  metrics,
  tabs,
  children,
}: DetailDrawerProps) {
  // If tabs are passed directly, active tab defaults to the first tab ID
  const [activeTab, setActiveTab] = useState<string>("OVERVIEW");

  useEffect(() => {
    if (tabs && tabs.length > 0) {
      setActiveTab(tabs[0].id);
    } else {
      setActiveTab("OVERVIEW");
    }
  }, [tabs]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Resolve Header Content
  const displayTitle = title || data?.title || "Details";
  const displayUid = data?.uid || data?.id;
  const displayStatus = typeof status === "string" ? status : status?.label || data?.status;
  const displayStatusVariant = typeof status === "object" ? status.variant : undefined;
  const displaySubtitle = subtitle || data?.location;
  const displayMetrics = metrics || data?.metrics;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Drawer Canvas */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <aside className="w-screen max-w-xl bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="flex flex-col border-b border-slate-200 bg-slate-50/70 p-6 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {displayUid && (
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
                    {displayUid}
                  </span>
                )}
                {displayStatus && (
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      displayStatusVariant === "critical"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : displayStatusVariant === "healthy"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {displayStatus}
                  </span>
                )}
                {data?.severity && <SeverityBadge severity={data.severity} />}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition cursor-pointer"
                title="Close drawer (Esc)"
              >
                <X className="h-5 w-5" strokeWidth={1.8} />
              </button>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {displayTitle}
              </h2>
              {displaySubtitle && (
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                  <span>{displaySubtitle}</span>
                </div>
              )}
            </div>

            {/* Quick Metrics Bar */}
            {displayMetrics && displayMetrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {displayMetrics.map((m) => (
                  <div key={m.label} className="p-2 rounded-xl border border-slate-200 bg-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                      {m.label}
                    </span>
                    <span className="text-xs font-black font-mono text-slate-900 mt-0.5 block truncate">
                      {m.value} {m.unit || ""}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab Navigation */}
            {tabs && tabs.length > 0 ? (
              <div className="flex items-center gap-1 pt-1 border-t border-slate-200/60 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-slate-900 text-white shadow-2xs"
                        : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1 pt-1 border-t border-slate-200/60">
                {(["OVERVIEW", "EVIDENCE", "TIMELINE", "ACTIONS"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeTab === tab
                        ? "bg-slate-900 text-white shadow-2xs"
                        : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                    }`}
                  >
                    {tab.charAt(0) + tab.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Body (Progressive Disclosure) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {tabs && tabs.length > 0 ? (
              tabs.find((t) => t.id === activeTab)?.content || children
            ) : data ? (
              <>
                {activeTab === "OVERVIEW" && (
                  <div className="space-y-5">
                    {data.narrative && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Operational Incident Narrative
                        </span>
                        <p className="text-sm text-slate-700 leading-relaxed p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                          {data.narrative}
                        </p>
                      </div>
                    )}

                    {data.primaryBarrier && (
                      <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                          Primary Defense Barrier
                        </span>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-bold text-slate-900">{data.primaryBarrier}</span>
                          </div>
                          <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            IOGP 459 Standard
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "EVIDENCE" && (
                  <div className="space-y-5">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Photographic Verification &amp; Physical Evidence
                      </span>

                      <div className="space-y-3">
                        {(data.evidenceImages && data.evidenceImages.length > 0
                          ? data.evidenceImages
                          : [
                              {
                                url: "/evidence/loto_valve.jpg",
                                title: "High-Pressure Manifold LOTO Lockout Verification",
                                caption: "Physical lock and danger tag #7845 attached to valve handle prior to line intervention.",
                                timestamp: data.timestamp || "Inspection Log",
                                assetId: data.asset || "V-102 Separator Manifold",
                                tag: "PHYSICAL LOCKOUT",
                              },
                              {
                                url: "/evidence/flange_inspection.jpg",
                                title: "Non-Destructive Ultrasonic Flange Testing",
                                caption: "NDT wall-thickness and torque seal integrity scan by certified safety technician.",
                                timestamp: data.timestamp || "Verification Audit",
                                assetId: "HP Condensate P-104",
                                tag: "ULTRASONIC SCAN",
                              },
                            ]
                        ).map((img, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs group"
                          >
                            <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                              <img
                                src={img.url}
                                alt={img.title}
                                className="h-full w-full object-cover object-center group-hover:scale-[1.02] transition duration-300"
                                loading="lazy"
                              />
                              {img.tag && (
                                <span className="absolute top-2.5 left-2.5 rounded bg-slate-900/85 backdrop-blur-xs px-2 py-0.5 text-[9px] font-mono font-bold text-white uppercase tracking-wider border border-white/20">
                                  {img.tag}
                                </span>
                              )}
                            </div>
                            <div className="p-3.5 space-y-1">
                              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                                <span>{img.title}</span>
                                {img.assetId && (
                                  <span className="font-mono text-[10px] text-slate-400">{img.assetId}</span>
                                )}
                              </div>
                              {img.caption && (
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                  {img.caption}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Official External Documents & Source Guidelines */}
                    <div className="pt-2 border-t border-slate-100 space-y-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                        Governing Regulatory Standards &amp; External Citations
                      </span>

                      <div className="space-y-2">
                        {(data.externalSources || [
                          {
                            name: "IOGP Report 459: Life-Saving Rules & Barrier Taxonomy",
                            authority: "International Association of Oil & Gas Producers",
                            url: "https://www.iogp.org/bookstore/product/iogp-report-459-life-saving-rules/",
                            code: "IOGP-459",
                          },
                          {
                            name: "OISD-STD-145: Work Permit & Energy Isolation Guidelines",
                            authority: "Oil Industry Safety Directorate of India",
                            url: "https://www.oisd.gov.in/standards",
                            code: "OISD-145",
                          },
                          {
                            name: "OSHA 1910.147: The Control of Hazardous Energy (Lockout/Tagout)",
                            authority: "Occupational Safety and Health Administration",
                            url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147",
                            code: "OSHA-1910",
                          },
                        ]).map((src, idx) => (
                          <a
                            key={idx}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition flex items-center justify-between gap-3 text-xs group cursor-pointer"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                                  {src.code || "STD"}
                                </span>
                                <span className="font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                                  {src.name}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                                {src.authority}
                              </span>
                            </div>
                            <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "TIMELINE" && (
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Sequence of Events
                    </span>

                    <div className="space-y-2.5 border-l-2 border-slate-200 pl-4 ml-2">
                      {(
                        data.timeline || [
                          { time: "09:14:22", event: "Vapor weepage detected during routine operator round" },
                          { time: "09:20:00", event: "Optical hydrocarbon sensor H-201 triggered alarm level 1" },
                          { time: "09:28:45", event: "Automated isolation interlock initiated by control room" },
                          { time: "09:40:12", event: "PTW suspended and shift supervisor notified" },
                        ]
                      ).map((t, idx) => (
                        <div key={idx} className="relative space-y-0.5">
                          <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-slate-900" />
                          <span className="text-[10px] font-mono font-bold text-slate-400 block">
                            {t.time}
                          </span>
                          <span className="text-xs font-medium text-slate-800 block">{t.event}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "ACTIONS" && (
                  <div className="space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Operational Safety Directive
                    </span>

                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 space-y-1">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Recommended Action
                      </span>
                      <p className="text-xs leading-relaxed text-emerald-800">
                        Enforce secondary blind plate insertion. Complete atmospheric re-test prior to
                        re-issuing work permit.
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              children
            )}
          </div>

          {/* Drawer Actions Footer */}
          <div className="p-5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              Dismiss
            </button>

            {data?.onConfirm && (
              <button
                type="button"
                onClick={() => {
                  data.onConfirm?.();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer shadow-xs"
              >
                Verify &amp; Confirm Sign-Off
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default DetailDrawer;
