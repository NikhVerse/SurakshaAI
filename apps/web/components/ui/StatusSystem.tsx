"use client";

import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import Tooltip from "./Tooltip";

export type StatusType = "CRITICAL" | "HIGH" | "MEDIUM" | "HEALTHY" | "INFO" | "NEUTRAL";

interface StatusDotProps {
  status: StatusType | string;
  pulse?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  showTooltip?: boolean;
}

export function StatusDot({
  status,
  pulse = false,
  size = "md",
  className = "",
  showTooltip = true,
}: StatusDotProps) {
  const normalized = (status || "").toUpperCase();

  const colorConfig: Record<string, { bg: string; label: string }> = {
    CRITICAL: { bg: "bg-rose-500", label: "Critical Priority" },
    HIGH: { bg: "bg-orange-500", label: "High Risk" },
    MEDIUM: { bg: "bg-amber-500", label: "Medium Concern" },
    HEALTHY: { bg: "bg-emerald-500", label: "Normal / Healthy" },
    VERIFIED: { bg: "bg-emerald-500", label: "Verified Active" },
    ONLINE: { bg: "bg-emerald-500", label: "Online & Active" },
    FAILED: { bg: "bg-rose-500", label: "Defensive Failure" },
    DEGRADED: { bg: "bg-amber-500", label: "Barrier Degraded" },
    INFO: { bg: "bg-blue-500", label: "Informational" },
    NEUTRAL: { bg: "bg-slate-400", label: "Neutral / Standby" },
  };

  const current = colorConfig[normalized] || colorConfig.NEUTRAL;
  const sizeClass = size === "sm" ? "h-1.5 w-1.5" : size === "lg" ? "h-3 w-3" : "h-2 w-2";

  const dot = (
    <span className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {pulse && (
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${current.bg}`}
        />
      )}
      <span className={`relative inline-flex rounded-full ${sizeClass} ${current.bg}`} />
    </span>
  );

  if (!showTooltip) return dot;
  return <Tooltip content={current.label}>{dot}</Tooltip>;
}

export function RiskScore({
  score,
  size = "md",
  showLabel = false,
}: {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}) {
  const isCritical = score >= 0.7;
  const isMedium = score >= 0.4 && score < 0.7;

  const colorClass = isCritical
    ? "text-rose-600 bg-rose-50 border-rose-200"
    : isMedium
    ? "text-amber-700 bg-amber-50 border-amber-200"
    : "text-emerald-700 bg-emerald-50 border-emerald-200";

  const textSize =
    size === "lg"
      ? "text-xl font-black px-2.5 py-1"
      : size === "sm"
      ? "text-[11px] font-bold px-1.5 py-0.5"
      : "text-xs font-extrabold px-2 py-0.5";

  return (
    <Tooltip content={`pSIF Probability: ${(score * 100).toFixed(0)}%`}>
      <span
        className={`inline-flex items-center gap-1 font-mono rounded-md border ${colorClass} ${textSize}`}
      >
        <span>{score.toFixed(2)}</span>
        {showLabel && (
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider">
            {isCritical ? "Crit" : isMedium ? "Med" : "Low"}
          </span>
        )}
      </span>
    </Tooltip>
  );
}

export function SeverityBadge({
  severity,
  className = "",
}: {
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | string;
  className?: string;
}) {
  const norm = severity.toUpperCase();

  if (norm === "CRITICAL" || norm === "FAILED") {
    return (
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-extrabold font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 ${className}`}
      >
        <XCircle className="h-3 w-3 text-rose-600" strokeWidth={2.5} />
        <span>CRITICAL</span>
      </span>
    );
  }

  if (norm === "HIGH" || norm === "DEGRADED") {
    return (
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-extrabold font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 ${className}`}
      >
        <AlertTriangle className="h-3 w-3 text-amber-600" strokeWidth={2.5} />
        <span>{norm === "DEGRADED" ? "DEGRADED" : "HIGH"}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-extrabold font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 ${className}`}
    >
      <CheckCircle2 className="h-3 w-3 text-emerald-600" strokeWidth={2.5} />
      <span>{norm === "VERIFIED" ? "VERIFIED" : "HEALTHY"}</span>
    </span>
  );
}
