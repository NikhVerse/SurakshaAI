"use client";

import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Clock,
  Slash,
  Radio,
  HelpCircle,
  Shield,
  ShieldAlert,
  Flame,
  Wind,
  Gauge,
  Thermometer,
  Lock,
  FileCheck,
  ClipboardCheck,
  HardHat,
  Power,
  Droplets,
  MapPin,
  Image as ImageIcon,
  Factory,
  Cog,
  ChevronRight,
  Search,
  Filter,
  RefreshCw,
  X,
  LucideIcon,
} from "lucide-react";
import { Tooltip } from "./Tooltip";

/**
 * Global Icon Design Tokens
 * Restrained stroke weight: 1.5px - 1.75px (standard 1.6px)
 * Strict sizing scale: XS(12px), SM(14px), DEFAULT(16px), MD(18px), LG(20px), XL(24px)
 */
export const ICON_TOKENS = {
  sizes: {
    xs: 12,
    sm: 14,
    default: 16,
    md: 18,
    lg: 20,
    xl: 24,
  },
  strokes: {
    subtle: 1.4,
    default: 1.6,
    strong: 1.8,
  },
} as const;

export type IconSizeKey = keyof typeof ICON_TOKENS.sizes;

// ── CUSTOM INDUSTRIAL SVG ICONS (Geometric, Outline-Based, 1.6px Stroke) ──

/**
 * P&ID Standard Industrial Process Valve
 */
export function ValveIcon({
  size = 16,
  strokeWidth = 1.6,
  className = "",
}: {
  size?: number | IconSizeKey;
  strokeWidth?: number;
  className?: string;
}) {
  const pixelSize = typeof size === "string" ? ICON_TOKENS.sizes[size] : size;
  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      {/* Dual opposing flow triangles */}
      <polygon points="3 6 12 12 3 18 3 6" />
      <polygon points="21 6 12 12 21 18 21 6" />
      {/* Actuator stem & handwheel */}
      <line x1="12" y1="12" x2="12" y2="4" />
      <line x1="8" y1="4" x2="16" y2="4" />
    </svg>
  );
}

/**
 * Industrial Pipeline Segment with Flange Joint
 */
export function PipelineIcon({
  size = 16,
  strokeWidth = 1.6,
  className = "",
}: {
  size?: number | IconSizeKey;
  strokeWidth?: number;
  className?: string;
}) {
  const pixelSize = typeof size === "string" ? ICON_TOKENS.sizes[size] : size;
  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      <line x1="2" y1="8" x2="22" y2="8" />
      <line x1="2" y1="16" x2="22" y2="16" />
      {/* Central Flange Coupler */}
      <rect x="10.5" y="6" width="3" height="12" rx="1" />
      <circle cx="12" cy="9.5" r="0.8" fill="currentColor" />
      <circle cx="12" cy="14.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

/**
 * Optical Gas Detection Point
 */
export function GasDetectorIcon({
  size = 16,
  strokeWidth = 1.6,
  className = "",
}: {
  size?: number | IconSizeKey;
  strokeWidth?: number;
  className?: string;
}) {
  const pixelSize = typeof size === "string" ? ICON_TOKENS.sizes[size] : size;
  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
    </svg>
  );
}

// ── STANDARDIZED STATUS ICONS ──

export type StandardStatus =
  | "SUCCESS"
  | "HEALTHY"
  | "WARNING"
  | "CRITICAL"
  | "INFO"
  | "PENDING"
  | "OFFLINE"
  | "LIVE"
  | "UNKNOWN";

export function StatusIcon({
  status,
  size = "sm",
  className = "",
}: {
  status: StandardStatus | string;
  size?: IconSizeKey | number;
  className?: string;
}) {
  const pixelSize = typeof size === "string" ? ICON_TOKENS.sizes[size] : size;
  const s = status.toUpperCase();

  switch (s) {
    case "SUCCESS":
    case "HEALTHY":
    case "VERIFIED":
      return (
        <CheckCircle2
          size={pixelSize}
          strokeWidth={ICON_TOKENS.strokes.default}
          className={`text-emerald-600 ${className}`}
        />
      );
    case "WARNING":
    case "DEGRADED":
    case "MODIFIED":
      return (
        <AlertTriangle
          size={pixelSize}
          strokeWidth={ICON_TOKENS.strokes.default}
          className={`text-amber-500 ${className}`}
        />
      );
    case "CRITICAL":
    case "FAILED":
    case "BREACH":
      return (
        <XCircle
          size={pixelSize}
          strokeWidth={ICON_TOKENS.strokes.default}
          className={`text-rose-600 ${className}`}
        />
      );
    case "INFO":
      return (
        <Info
          size={pixelSize}
          strokeWidth={ICON_TOKENS.strokes.default}
          className={`text-blue-500 ${className}`}
        />
      );
    case "PENDING":
      return (
        <Clock
          size={pixelSize}
          strokeWidth={ICON_TOKENS.strokes.default}
          className={`text-slate-400 ${className}`}
        />
      );
    case "OFFLINE":
      return (
        <Slash
          size={pixelSize}
          strokeWidth={ICON_TOKENS.strokes.default}
          className={`text-slate-400 ${className}`}
        />
      );
    case "LIVE":
      return (
        <Radio
          size={pixelSize}
          strokeWidth={ICON_TOKENS.strokes.default}
          className={`text-emerald-500 animate-pulse ${className}`}
        />
      );
    default:
      return (
        <HelpCircle
          size={pixelSize}
          strokeWidth={ICON_TOKENS.strokes.default}
          className={`text-slate-400 ${className}`}
        />
      );
  }
}

// ── STANDARDIZED SEVERITY ICONS ──

export type SeverityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";

export function SeverityIcon({
  severity,
  size = "sm",
  className = "",
}: {
  severity: SeverityLevel | string;
  size?: IconSizeKey | number;
  className?: string;
}) {
  const pixelSize = typeof size === "string" ? ICON_TOKENS.sizes[size] : size;
  const s = severity.toUpperCase();

  switch (s) {
    case "CRITICAL":
      return (
        <ShieldAlert
          size={pixelSize}
          strokeWidth={ICON_TOKENS.strokes.default}
          className={`text-rose-600 ${className}`}
        />
      );
    case "HIGH":
      return (
        <AlertTriangle
          size={pixelSize}
          strokeWidth={ICON_TOKENS.strokes.default}
          className={`text-orange-500 ${className}`}
        />
      );
    case "MEDIUM":
      return (
        <AlertTriangle
          size={pixelSize}
          strokeWidth={ICON_TOKENS.strokes.default}
          className={`text-amber-500 ${className}`}
        />
      );
    default:
      return (
        <Info
          size={pixelSize}
          strokeWidth={ICON_TOKENS.strokes.default}
          className={`text-blue-500 ${className}`}
        />
      );
  }
}

// ── STANDARDIZED INDUSTRIAL SAFETY SEMANTIC VOCABULARY ──

export type IndustrialConcept =
  | "gas"
  | "fire"
  | "pressure"
  | "temperature"
  | "valve"
  | "pipeline"
  | "isolation"
  | "permit"
  | "inspection"
  | "equipment"
  | "worker"
  | "shutdown"
  | "leak"
  | "barrier"
  | "risk"
  | "evidence"
  | "location";

export function IndustrialIcon({
  concept,
  size = "default",
  className = "",
}: {
  concept: IndustrialConcept | string;
  size?: IconSizeKey | number;
  className?: string;
}) {
  const pixelSize = typeof size === "string" ? ICON_TOKENS.sizes[size] : size;
  const c = concept.toLowerCase();

  if (c.includes("valve")) return <ValveIcon size={pixelSize} className={className} />;
  if (c.includes("pipe")) return <PipelineIcon size={pixelSize} className={className} />;
  if (c.includes("gas") || c.includes("vapor"))
    return <Wind size={pixelSize} strokeWidth={1.6} className={className} />;
  if (c.includes("fire") || c.includes("ignition") || c.includes("hot work"))
    return <Flame size={pixelSize} strokeWidth={1.6} className={className} />;
  if (c.includes("pressure"))
    return <Gauge size={pixelSize} strokeWidth={1.6} className={className} />;
  if (c.includes("temp"))
    return <Thermometer size={pixelSize} strokeWidth={1.6} className={className} />;
  if (c.includes("isolat") || c.includes("lock"))
    return <Lock size={pixelSize} strokeWidth={1.6} className={className} />;
  if (c.includes("permit") || c.includes("ptw"))
    return <FileCheck size={pixelSize} strokeWidth={1.6} className={className} />;
  if (c.includes("inspect"))
    return <ClipboardCheck size={pixelSize} strokeWidth={1.6} className={className} />;
  if (c.includes("worker") || c.includes("personnel"))
    return <HardHat size={pixelSize} strokeWidth={1.6} className={className} />;
  if (c.includes("shutdown") || c.includes("esd"))
    return <Power size={pixelSize} strokeWidth={1.6} className={className} />;
  if (c.includes("leak") || c.includes("drain"))
    return <Droplets size={pixelSize} strokeWidth={1.6} className={className} />;
  if (c.includes("risk") || c.includes("psif"))
    return <ShieldAlert size={pixelSize} strokeWidth={1.6} className={className} />;
  if (c.includes("evidence") || c.includes("photo"))
    return <ImageIcon size={pixelSize} strokeWidth={1.6} className={className} />;
  if (c.includes("location") || c.includes("site"))
    return <MapPin size={pixelSize} strokeWidth={1.6} className={className} />;

  // Default: Shield Barrier
  return <Shield size={pixelSize} strokeWidth={1.6} className={className} />;
}

// ── COMPACT PRODUCT-GRADE ICON BUTTON ──

export function IconButton({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  size = "default",
  variant = "neutral",
  className = "",
}: {
  icon: LucideIcon | React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  size?: "sm" | "default" | "lg";
  variant?: "neutral" | "primary" | "danger";
  className?: string;
}) {
  const containerClass =
    size === "sm"
      ? "w-7 h-7 rounded-lg"
      : size === "lg"
      ? "w-10 h-10 rounded-xl"
      : "w-8 h-8 rounded-lg";
  const iconPixel = size === "sm" ? 14 : size === "lg" ? 18 : 16;

  const variantClass =
    variant === "primary"
      ? "bg-black text-white hover:bg-neutral-800"
      : variant === "danger"
      ? "text-neutral-500 hover:text-rose-600 hover:bg-rose-50"
      : "text-neutral-600 hover:text-black hover:bg-neutral-100 border border-neutral-200/80 bg-white";

  return (
    <Tooltip content={label}>
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        disabled={disabled}
        className={`inline-flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${containerClass} ${variantClass} ${className}`}
      >
        <Icon size={iconPixel} strokeWidth={1.6} />
      </button>
    </Tooltip>
  );
}
