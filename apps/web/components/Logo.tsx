"use client";

import React from "react";

export interface LogoProps {
  size?: "xs" | "sm" | "small" | "default" | "md" | "lg" | "large" | "xl" | "icon";
  iconOnly?: boolean;
  inverted?: boolean; // white on black
  className?: string;
  variant?: "primary" | "horizontal" | "symbol" | "wordmark";
}

/**
 * Geometric Symbol SVG for SURAKSHA AI
 * Strict pure Black & White geometry.
 * Interlocking dual-faceted structural vault with negative-space geometric "S".
 * Mathematically balanced for 16px, 24px, 32px, 48px, 64px display.
 */
export function SurakshaSymbol({
  size = 32,
  inverted = false,
  className = "",
}: {
  size?: number;
  inverted?: boolean;
  className?: string;
}) {
  const primaryColor = inverted ? "#FFFFFF" : "#000000";
  const bgColor = inverted ? "#000000" : "#FFFFFF";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label="Suraksha AI Symbol"
    >
      {/* 
        Precision Geometric Architecture:
        Two interlocking precision-chamfered geometric angular vaults
        forming an abstract geometric 'S' through a calibrated negative-space diagonal rift.
      */}
      {/* Top Wing / Upper Vault */}
      <path
        d="M6 14L24 4L42 14V21L36 17.5L24 10.8L12 17.5V30.5L6 27V14Z"
        fill={primaryColor}
      />

      {/* Bottom Wing / Lower Vault */}
      <path
        d="M42 34L24 44L6 34V27L12 30.5L24 37.2L36 30.5V17.5L42 21V34Z"
        fill={primaryColor}
      />

      {/* Central Geometric Interlocking S-Nucleus */}
      <path
        d="M17 19.5L24 15.5L31 19.5V23L27 21L24 19.2L20 21.5V26.5L27 30.5L31 28V31.5L24 35.5L17 31.5V28L21 30L24 31.8L28 29.5V24.5L21 20.5L17 23V19.5Z"
        fill={primaryColor}
      />
    </svg>
  );
}

export default function Logo({
  size = "default",
  iconOnly = false,
  inverted = false,
  className = "",
  variant = "horizontal",
}: LogoProps) {
  // Normalize size scale
  const isIcon = size === "icon" || iconOnly || variant === "symbol";
  const pixelSize =
    size === "xs"
      ? 18
      : size === "sm" || size === "small"
      ? 24
      : size === "icon"
      ? 28
      : size === "md"
      ? 30
      : size === "lg" || size === "large"
      ? 38
      : size === "xl"
      ? 48
      : 32;

  const textColor = inverted ? "text-white" : "text-black";
  const subtextColor = inverted ? "text-neutral-400" : "text-neutral-500";

  if (variant === "wordmark") {
    return (
      <div className={`inline-flex items-baseline gap-1.5 select-none font-sans ${className}`}>
        <span className={`font-black tracking-[0.18em] uppercase ${textColor} text-base sm:text-lg`}>
          SURAKSHA
        </span>
        <span className={`font-semibold tracking-[0.22em] uppercase text-xs sm:text-sm ${subtextColor}`}>
          AI
        </span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none group transition-opacity hover:opacity-90 ${className}`}
    >
      <SurakshaSymbol size={pixelSize} inverted={inverted} />

      {!isIcon && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-black tracking-[0.16em] uppercase ${textColor} ${
                size === "large" || size === "lg"
                  ? "text-xl"
                  : size === "small" || size === "sm"
                  ? "text-sm"
                  : "text-base"
              }`}
            >
              SURAKSHA
            </span>
            <span
              className={`font-semibold tracking-[0.2em] uppercase ${subtextColor} ${
                size === "large" || size === "lg"
                  ? "text-xs"
                  : size === "small" || size === "sm"
                  ? "text-[11px]"
                  : "text-[12px]"
              }`}
            >
              AI
            </span>
          </div>
          {size !== "sm" && size !== "small" && (
            <span
              className={`text-[9.5px] font-bold uppercase tracking-[0.24em] ${subtextColor} font-mono mt-1`}
            >
              Industrial Safety Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export { Logo };
