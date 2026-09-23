"use client";

import React, { useEffect, useState } from "react";
import {
  Settings,
  Cpu,
  User,
  Shield,
  CheckCircle2,
  Lock,
  Terminal,
  Database,
  Key,
  Server,
  Zap,
  Check,
  ExternalLink,
  Sparkles,
  Layers,
  ChevronRight,
  Sliders,
  Eye,
  EyeOff,
  Radio,
} from "lucide-react";
import { chatApi, ModelInfo, ModelProviderInfo, ModelsResponse } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function SettingsPage() {
  const { user } = useAuth();
  const [modelData, setModelData] = useState<ModelsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<string>("ALL");
  const [activeModelId, setActiveModelId] = useState<string>("mistral:7b");
  const [toast, setToast] = useState<string | null>(null);

  // API Key Form State
  const [showKeys, setShowKeys] = useState(false);
  const [keys, setKeys] = useState({
    openai: "",
    anthropic: "",
    gemini: "",
    ollamaUrl: "http://localhost:11434",
  });

  useEffect(() => {
    // Load persisted settings
    const savedModel = localStorage.getItem("suraksha_active_model");
    if (savedModel) setActiveModelId(savedModel);

    const savedKeys = localStorage.getItem("suraksha_provider_keys");
    if (savedKeys) {
      try {
        setKeys(JSON.parse(savedKeys));
      } catch {}
    }

    chatApi
      .getModels()
      .then((res) => {
        setModelData(res);
      })
      .catch((err) => {
        console.error("Failed to load models:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelectModel = (id: string, name: string) => {
    setActiveModelId(id);
    localStorage.setItem("suraksha_active_model", id);
    setToast(`Active model switched to ${name} (${id})`);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("suraksha_provider_keys", JSON.stringify(keys));
    setToast("Model provider configuration saved successfully.");
    setTimeout(() => setToast(null), 3500);
  };

  const roleLabel = (role?: string) =>
    role ? role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "HSE Lead Analyst";

  const initials = (user?.full_name || "Priya Sharma")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const filteredModels = (modelData?.categorized_models || []).filter((m) => {
    if (selectedProvider === "ALL") return true;
    return m.provider.toLowerCase() === selectedProvider.toLowerCase();
  });

  return (
    <div className="space-y-10 max-w-5xl pb-20 font-sans">
      {/* Toast Notice */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Platform Settings &amp; Model Architecture
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
          Manage inference models across Ollama, Claude, Gemini, OpenAI, and security parameters
        </p>
      </div>

      {/* Account Details */}
      <div className="rounded-2xl border border-slate-200 bg-white p-7 space-y-6 shadow-2xs">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <User className="h-5 w-5 text-slate-700" strokeWidth={1.8} />
          <h2 className="text-base font-bold text-slate-900">Active Operator Identity</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white text-lg font-black shadow-xs">
            {initials}
          </div>
          <div>
            <p className="text-base font-bold text-slate-900">{user?.full_name || "Priya Sharma"}</p>
            <p className="text-xs text-slate-500 font-medium">{user?.email || "analyst@suraksha.ai"}</p>
            <span className="inline-flex items-center mt-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
              {roleLabel(user?.role)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Operator Identifier
            </label>
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs text-slate-700">
              {user?.id ? user.id.slice(0, 20) + "..." : "usr-ops-priya-01"}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Access Permission Level
            </label>
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs text-slate-700">
              L4 Certified Incident Investigator &amp; Barrier Assessor
            </div>
          </div>
        </div>
      </div>

      {/* Model Providers & Categorized Models Hub */}
      <div className="rounded-2xl border border-slate-200 bg-white p-7 space-y-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Cpu className="h-5 w-5 text-slate-800" strokeWidth={1.8} />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Multi-Model Inference Registry</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Categorized models across private on-premises and frontier cloud providers
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active: <strong className="font-mono text-slate-900">{activeModelId}</strong></span>
          </div>
        </div>

        {/* 4 Provider Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            { name: "Ollama", category: "Private On-Prem", badge: "Air-Gapped", desc: "Local low-latency inference with zero egress." },
            { name: "Anthropic", category: "Frontier Reasoning", badge: "Claude 3.7 / 3.5", desc: "Deep root-cause and BowTie barrier causality." },
            { name: "Google Gemini", category: "Multimodal Engine", badge: "2M Context", desc: "Full plant manuals, P&ID schematics & telemetry." },
            { name: "OpenAI", category: "Frontier & STEM", badge: "GPT-4o / o1 / o3", desc: "Physical risk calculation & energy isolation logic." },
          ].map((p) => {
            const isSelected = selectedProvider.toLowerCase() === p.name.toLowerCase() || (selectedProvider === "ALL" && p.name === "Ollama");
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => setSelectedProvider(selectedProvider === p.name ? "ALL" : p.name)}
                className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 ${
                  selectedProvider.toLowerCase() === p.name.toLowerCase()
                    ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                    : "border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 text-slate-800"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-sm">{p.name}</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      selectedProvider.toLowerCase() === p.name.toLowerCase()
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {p.badge}
                  </span>
                </div>
                <p
                  className={`text-xs ${
                    selectedProvider.toLowerCase() === p.name.toLowerCase() ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  {p.desc}
                </p>
                <span
                  className={`text-[11px] font-semibold flex items-center gap-1 ${
                    selectedProvider.toLowerCase() === p.name.toLowerCase() ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  {selectedProvider.toLowerCase() === p.name.toLowerCase() ? "Showing Models" : "Filter Category"}
                  <ChevronRight className="h-3 w-3" />
                </span>
              </button>
            );
          })}
        </div>

        {/* Model Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2">
          {["ALL", "Ollama", "Anthropic", "Google Gemini", "OpenAI"].map((prov) => (
            <button
              key={prov}
              type="button"
              onClick={() => setSelectedProvider(prov)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                selectedProvider === prov
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {prov === "ALL" ? "All Models (16)" : prov}
            </button>
          ))}
        </div>

        {/* Categorized Model Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredModels.map((m) => {
            const isActive = activeModelId === m.id;
            return (
              <div
                key={m.id}
                onClick={() => handleSelectModel(m.id, m.name)}
                className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                  isActive
                    ? "border-slate-900 bg-white ring-2 ring-slate-900 shadow-xs"
                    : "border-slate-200 bg-slate-50/40 hover:bg-white hover:border-slate-300 shadow-2xs"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{m.name}</span>
                      {isActive && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold">
                          <Check className="h-3 w-3" strokeWidth={2.5} /> Active
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs text-slate-500 font-semibold block mt-0.5">{m.id}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {m.context_window}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {m.badge}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">{m.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">{m.provider}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 font-medium">{m.category}</span>
                  </div>

                  <span className={`text-[11px] font-bold ${m.is_local ? "text-emerald-700" : "text-slate-700"}`}>
                    {m.is_local ? "🔒 Air-Gapped" : "⚡ Cloud API"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Provider Keys Configuration Drawer */}
        <div className="pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowKeys(!showKeys)}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            <Key className="h-4 w-4 text-slate-500" strokeWidth={1.8} />
            <span>{showKeys ? "Hide Custom Provider API Keys" : "Configure Custom Provider API Keys & Endpoints"}</span>
            <ChevronRight className={`h-3.5 w-3.5 transition-transform ${showKeys ? "rotate-90" : ""}`} />
          </button>

          {showKeys && (
            <form onSubmit={handleSaveKeys} className="mt-4 p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your optional API keys for cloud frontier models. If no keys are provided, SurakshaAI automatically uses
                the local Ollama model or the sovereign grounded RAG safety engine with zero external network egress.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">OpenAI API Key</label>
                  <input
                    type="password"
                    placeholder="sk-proj-..."
                    value={keys.openai}
                    onChange={(e) => setKeys({ ...keys, openai: e.target.value })}
                    className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Anthropic API Key</label>
                  <input
                    type="password"
                    placeholder="sk-ant-api03-..."
                    value={keys.anthropic}
                    onChange={(e) => setKeys({ ...keys, anthropic: e.target.value })}
                    className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Google Gemini API Key</label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={keys.gemini}
                    onChange={(e) => setKeys({ ...keys, gemini: e.target.value })}
                    className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ollama Local Endpoint</label>
                  <input
                    type="text"
                    placeholder="http://localhost:11434"
                    value={keys.ollamaUrl}
                    onChange={(e) => setKeys({ ...keys, ollamaUrl: e.target.value })}
                    className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer shadow-xs"
                >
                  Save Provider Configuration
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Security & Audit Parameters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-7 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <Shield className="h-5 w-5 text-emerald-600" strokeWidth={1.8} />
          <h2 className="text-base font-bold text-slate-900">Compliance &amp; Data Sovereignty</h2>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" strokeWidth={1.8} />
            <span>All decision trails recorded in append-only SQLite / Postgres Audit Log</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" strokeWidth={1.8} />
            <span>JWT tokens cryptographically signed with HS256 HMAC</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" strokeWidth={1.8} />
            <span>IOGP 459 / OISD-GDN-145 process safety regulatory alignment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
