"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import Tooltip from "./Tooltip";

export function Sparkline({
  data = [65, 68, 72, 70, 78, 85, 82],
  color = "#2563eb",
  width = 64,
  height = 20,
}: {
  data?: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function TrendIndicator({
  change,
  direction,
  label,
  isPositive,
}: {
  change?: number;
  direction?: "up" | "down" | "flat" | string;
  label?: string;
  isPositive?: boolean;
}) {
  if (label || direction) {
    const isUp = direction === "up" || label?.toLowerCase().includes("increasing");
    const isDown = direction === "down" || label?.toLowerCase().includes("decreasing");
    const isGood = isPositive !== undefined ? isPositive : !isUp;

    return (
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded-full ${
          isGood
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-rose-50 text-rose-700 border border-rose-200"
        }`}
      >
        {isUp && <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />}
        {isDown && <ArrowDownRight className="h-3 w-3" strokeWidth={2.5} />}
        {!isUp && !isDown && <Minus className="h-3 w-3" strokeWidth={2} />}
        <span>{label || (isUp ? "Increasing" : isDown ? "Decreasing" : "Stable")}</span>
      </span>
    );
  }

  const num = change || 0;
  if (num > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] font-bold font-mono text-rose-600">
        <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
        <span>+{num.toFixed(1)}%</span>
      </span>
    );
  }
  if (num < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] font-bold font-mono text-emerald-600">
        <ArrowDownRight className="h-3 w-3" strokeWidth={2.5} />
        <span>{num.toFixed(1)}%</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-bold font-mono text-slate-400">
      <Minus className="h-3 w-3" strokeWidth={2} />
      <span>0.0%</span>
    </span>
  );
}

export function LiveValue({
  label,
  value,
  unit,
  trend,
  status = "HEALTHY",
}: {
  label: string;
  value: string | number;
  unit: string;
  trend?: number;
  status?: "HEALTHY" | "DEGRADED" | "CRITICAL";
}) {
  const dotColor =
    status === "CRITICAL"
      ? "bg-rose-500"
      : status === "DEGRADED"
      ? "bg-amber-500"
      : "bg-emerald-500";

  return (
    <div className="flex flex-col p-3 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <span className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${dotColor} animate-pulse`} />
          <span className="text-[9.5px] font-mono font-bold uppercase tracking-widest text-slate-400">
            LIVE
          </span>
        </span>
      </div>

      <div className="flex items-baseline gap-1 mt-1.5">
        <span className="text-xl font-black font-mono text-slate-900 tracking-tight">
          {value}
        </span>
        <span className="text-xs font-semibold text-slate-500">{unit}</span>
      </div>

      {trend !== undefined && (
        <div className="mt-1 pt-1 border-t border-slate-100 flex items-center justify-between">
          <TrendIndicator change={trend} />
          <Sparkline color={status === "CRITICAL" ? "#ef4444" : "#10b981"} />
        </div>
      )}
    </div>
  );
}
