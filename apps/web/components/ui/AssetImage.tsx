"use client";

import React from "react";
import { Factory, Flame, Waves, Wind, Fuel } from "lucide-react";

interface AssetImageProps {
  assetCode: string;
  name: string;
  className?: string;
  height?: number;
}

export default function AssetImage({ assetCode, name, className = "", height = 140 }: AssetImageProps) {
  const code = (assetCode || "").toUpperCase();

  // Visual scheme based on authentic operational asset category
  const assetConfig: Record<
    string,
    { icon: React.ComponentType<{ className?: string }>; grad: string; accent: string; type: string }
  > = {
    MUM: {
      icon: Waves,
      grad: "from-sky-950 via-slate-900 to-blue-900",
      accent: "#38bdf8",
      type: "Offshore Production Platform",
    },
    DGB: {
      icon: Flame,
      grad: "from-amber-950 via-slate-900 to-orange-950",
      accent: "#f97316",
      type: "Atmospheric Distillation Unit",
    },
    HZR: {
      icon: Wind,
      grad: "from-cyan-950 via-slate-900 to-slate-950",
      accent: "#06b6d4",
      type: "Cryogenic Gas Regasification",
    },
    BRM: {
      icon: Fuel,
      grad: "from-stone-900 via-yellow-950 to-amber-950",
      accent: "#eab308",
      type: "Desert Pipeline Gathering",
    },
    PDP: {
      icon: Factory,
      grad: "from-indigo-950 via-slate-900 to-violet-950",
      accent: "#a855f7",
      type: "Fluidized Catalytic Cracker",
    },
  };

  const key = Object.keys(assetConfig).find((k) => code.includes(k)) || "MUM";
  const config = assetConfig[key];
  const Icon = config.icon;

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden bg-gradient-to-br ${config.grad} flex flex-col justify-between p-4 select-none ${className}`}
      style={{ height: `${height}px` }}
    >
      {/* Background Architectural Grid Pattern */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Top Banner Tag */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[10px] font-bold font-mono tracking-widest uppercase px-2 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/15">
          {config.type}
        </span>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ONLINE
        </span>
      </div>

      {/* Center Icon Schematic */}
      <div className="relative z-10 flex items-end justify-between">
        <div>
          <span className="text-white font-black text-sm tracking-tight block drop-shadow-sm truncate max-w-[220px]">
            {name}
          </span>
          <span className="text-white/60 font-mono text-[10px] block mt-0.5">
            Asset Code: {assetCode}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-white/10 border border-white/15 text-white backdrop-blur-xs">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
