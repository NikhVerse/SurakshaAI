"use client";

import React from "react";

interface LogoProps {
  size?: "small" | "default" | "large" | "icon";
  iconOnly?: boolean;
  className?: string;
}

export default function Logo({
  size = "default",
  iconOnly = false,
  className = "",
}: LogoProps) {
  // Dimensions
  const glyphSize =
    size === "icon" ? 34 : size === "small" ? 28 : size === "large" ? 44 : 36;
  const textSize =
    size === "small"
      ? "text-base tracking-[0.16em]"
      : size === "large"
      ? "text-2xl tracking-[0.18em]"
      : "text-lg tracking-[0.18em]";
  const subSize =
    size === "small"
      ? "text-[9px] tracking-[0.22em]"
      : size === "large"
      ? "text-[11px] tracking-[0.25em]"
      : "text-[9.5px] tracking-[0.22em]";

  return (
    <div
      className={`inline-flex items-center gap-3 select-none group transition-transform duration-200 hover:scale-[1.02] ${className}`}
    >
      {/* Precision Geometric SVG Emblem */}
      <div
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: glyphSize, height: glyphSize }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          <defs>
            <linearGradient id="facet-top" x1="8" y1="6" x2="40" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="facet-left" x1="6" y1="16" x2="24" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="facet-right" x1="24" y1="24" x2="42" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="facet-core" x1="16" y1="16" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Top Isometric Facet */}
          <path
            d="M24 5.5L41 15.3L24 25L7 15.3L24 5.5Z"
            fill="url(#facet-top)"
          />

          {/* Left Isometric Facet */}
          <path
            d="M6 16.8L23 26.5V44L6 34.2V16.8Z"
            fill="url(#facet-left)"
          />

          {/* Right Isometric Facet */}
          <path
            d="M25 26.5L42 16.8V34.2L25 44V26.5Z"
            fill="url(#facet-right)"
          />

          {/* Central Geometric Negative Space Prism */}
          <path
            d="M24 16.5L30.5 20.2V27.8L24 31.5L17.5 27.8V20.2L24 16.5Z"
            fill="url(#facet-core)"
            className="transition-all duration-300 group-hover:scale-95"
            style={{ transformOrigin: "24px 24px" }}
          />

          {/* Precision Center Pin */}
          <circle cx="24" cy="24" r="2.2" fill="#0F172A" />
        </svg>
      </div>

      {/* Clean Minimalist Typography Wordmark (hidden if iconOnly) */}
      {!iconOnly && size !== "icon" && (
        <div className="flex flex-col justify-center leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black text-slate-900 ${textSize} uppercase font-sans`}
            >
              Suraksha
            </span>
          </div>
          <span
            className={`font-bold text-slate-400 ${subSize} uppercase font-mono mt-0.5`}
          >
            Safety Intelligence
          </span>
        </div>
      )}
    </div>
  );
}
