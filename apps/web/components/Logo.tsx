"use client";

import React from "react";

interface LogoProps {
  size?: "small" | "default" | "large";
}

export default function Logo({ size = "default" }: LogoProps) {
  // Enhanced scale: bigger and clearly legible
  const height = size === "small" ? 48 : size === "large" ? 92 : 68;
  const width = Math.round(height * (386 / 271));

  return (
    <div className="flex items-center select-none py-0.5">
      <img
        src="/logo-tight.png"
        alt="Suraksha-AI"
        width={width}
        height={height}
        className="object-contain transition-transform duration-200 hover:scale-105"
        style={{ height: `${height}px`, width: "auto" }}
      />
    </div>
  );
}
