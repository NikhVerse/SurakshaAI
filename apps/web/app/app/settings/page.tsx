"use client";

import React, { useEffect, useState } from "react";
import { Settings, Cpu, User, Shield, CheckCircle2, Lock, Terminal, Database } from "lucide-react";
import { chatApi, OllamaModel } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function SettingsPage() {
  const { user } = useAuth();
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [ollamaStatus, setOllamaStatus] = useState<"loading" | "connected" | "unavailable">("loading");

  useEffect(() => {
    chatApi.getModels()
      .then((res) => {
        setModels(res.models);
        setOllamaStatus(res.status === "connected" ? "connected" : "unavailable");
      })
      .catch(() => setOllamaStatus("unavailable"));
  }, []);

  const roleLabel = (role?: string) =>
    role ? role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "HSE Lead Analyst";

  const initials = (user?.full_name || "Priya Sharma")
    .split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="space-y-8 max-w-3xl pb-16">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Platform Settings &amp; Governance
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Account credentials, sovereign ML engine configuration, and compliance parameters
        </p>
      </div>

      {/* Account Details */}
      <div className="rounded-2xl border border-slate-200 bg-white p-7 space-y-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <User className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">Active Operator Identity</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white text-lg font-black">
            {initials}
          </div>
          <div>
            <p className="text-base font-bold text-slate-900">{user?.full_name || "Priya Sharma"}</p>
            <p className="text-xs text-slate-500 font-medium">{user?.email || "analyst@suraksha.ai"}</p>
            <span className="inline-flex items-center mt-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
              {roleLabel(user?.role)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Operator Identifier
            </label>
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs text-slate-700">
              {user?.id ? user.id.slice(0, 18) + "..." : "usr-ops-priya-01"}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Access Permission Level
            </label>
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs text-slate-700">
              L4 Certified Incident Investigator
            </div>
          </div>
        </div>
      </div>

      {/* Sovereign Safety Engine Configuration */}
      <div className="rounded-2xl border border-slate-200 bg-white p-7 space-y-6 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Cpu className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Sovereign Safety AI Engine</h2>
          </div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Air-Gapped &amp; Operational</span>
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          SurakshaAI runs 100% on-premises using local vector embeddings (BM25 + Semantic Hybrid) and sovereign RAG retrieval.
          Zero telemetry or incident narrative data leaves your enterprise firewall.
        </p>

        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-800">Local Inference Engine</span>
            <span className="text-slate-600 font-semibold">Ollama Local API / Sovereign RAG Fallback</span>
          </div>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-800">Vector Knowledge Store</span>
            <span className="text-slate-600 font-semibold">In-Memory Qdrant-Compatible Collection</span>
          </div>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-800">Safety Standards Baseline</span>
            <span className="text-slate-600 font-semibold">IOGP Report 501/502 &amp; OISD-GDN-145</span>
          </div>
        </div>
      </div>

      {/* Security & Audit Parameters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-7 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <Shield className="h-5 w-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">Compliance &amp; Data Sovereignty</h2>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>All decision trails recorded in append-only SQLite Audit Log</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>JWT tokens cryptographically signed with HS256 HMAC</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Strict Light-Theme High-Contrast industrial ergonomics</span>
          </div>
        </div>
      </div>
    </div>
  );
}
