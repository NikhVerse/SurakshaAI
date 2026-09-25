"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  BookOpen,
  Code,
  Server,
  Shield,
  Search,
  Copy,
  Check,
  Cpu,
  Layers,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileCode,
  Database,
  Terminal,
} from "lucide-react";

interface DocSection {
  id: string;
  category: string;
  title: string;
  badge?: string;
  summary: string;
  content: React.ReactNode;
}

export default function DocsPage() {
  const [activeId, setActiveId] = useState("system-overview");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const SECTIONS: DocSection[] = [
    {
      id: "system-overview",
      category: "Architecture & Standards",
      title: "System Architecture & Philosophy",
      badge: "IOGP 459 Aligned",
      summary: "Explainable critical-risk intelligence decoupling statistical ML from narrative LLM synthesis.",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Architectural Foundation</h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              SurakshaAI operates on an industrial-grade safety intelligence architecture engineered for Health,
              Safety, and Environment (HSE) organizations. Traditional safety analytics aggregate lagging
              indicators (Total Recordable Incident Rates), which fail to anticipate catastrophic events. SurakshaAI
              analyzes raw unstructured near-miss narratives to uncover <strong>precursors to Potential Serious Injuries and Fatalities (pSIF)</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Principle 1</span>
              <h4 className="text-base font-bold text-slate-900">Strict Safety Decoupling</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                LLMs never compute safety probabilities. High-consequence pSIF scores derive solely from calibrated gradient-boosted ensemble models trained on industrial energy exposure physics.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Principle 2</span>
              <h4 className="text-lg font-bold text-slate-900">Air-Gapped Privacy</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                All narrative understanding and extraction operates on localized Ollama inference. Zero internal telemetry, worker identities, or facility narratives leave your sovereign network.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border-l-4 border-l-amber-500 border border-slate-200 bg-amber-50/40 space-y-2">
            <h4 className="text-base font-bold text-amber-950 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Non-Negotiable HSE Decision-Support Boundary
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              SurakshaAI is an advisory intelligence engine, not an autonomous safety controller. All automated classifications represent probabilistic recommendations for qualified human HSE professionals. Human primacy is enforced at every workflow step.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "calibrated-risk",
      category: "Machine Learning Core",
      title: "Calibrated pSIF Classification",
      badge: "Rare-Event PR-AUC: 0.88",
      summary: "Platt-sigmoid scaling applied to gradient-boosted decision trees with asymmetric F2 recall weighting.",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Mathematical Calibration Strategy</h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Standard deep learning and uncalibrated classification algorithms exhibit extreme overconfidence on high-imbalance safety data where near-misses outnumber actual catastrophic events 500:1. SurakshaAI applies rigorous <strong>Platt Sigmoid Scaling</strong> to calibrate probabilities:
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 text-slate-200 font-mono text-sm leading-relaxed overflow-x-auto">
            {`P(pSIF = 1 | f(x)) = 1 / (1 + exp(A * f(x) + B))
Where:
  f(x) : Margin prediction from gradient boosted ensemble
  A, B : Calibrated maximum-likelihood sigmoid parameters
Optimization Target: Minimize Brier score while enforcing F2 recall >= 0.90`}
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-900">Classification Severity Tiers</h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Probability Range</th>
                    <th className="px-6 py-4">Risk Tier</th>
                    <th className="px-6 py-4">Action Protocol</th>
                    <th className="px-6 py-4">SLA Window</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="px-6 py-4 font-mono font-bold text-rose-600">&ge; 75.0%</td>
                    <td className="px-6 py-4"><span className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">CRITICAL SIF</span></td>
                    <td className="px-6 py-4 text-slate-700">Immediate supervisor alert &amp; work halt review</td>
                    <td className="px-6 py-4 font-bold text-slate-900">Immediate (&lt; 2 hrs)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono font-bold text-amber-600">60.0% &ndash; 74.9%</td>
                    <td className="px-6 py-4"><span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">HIGH PRIORITY</span></td>
                    <td className="px-6 py-4 text-slate-700">Triage queue priority allocation for HSE analyst</td>
                    <td className="px-6 py-4 font-bold text-slate-900">Same Shift (&lt; 8 hrs)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono font-bold text-sky-600">30.0% &ndash; 59.9%</td>
                    <td className="px-6 py-4"><span className="px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-bold border border-sky-200">ELEVATED</span></td>
                    <td className="px-6 py-4 text-slate-700">Routine barrier verification &amp; tracking</td>
                    <td className="px-6 py-4 font-bold text-slate-900">24 Hours</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono font-bold text-slate-500">&lt; 30.0%</td>
                    <td className="px-6 py-4"><span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">ROUTINE</span></td>
                    <td className="px-6 py-4 text-slate-700">Automated registry logging</td>
                    <td className="px-6 py-4 font-bold text-slate-900">Weekly Batch</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "precursors-clustering",
      category: "Machine Learning Core",
      title: "Unsupervised Precursor Discovery",
      badge: "HDBSCAN + Embeddings",
      summary: "Hierarchical Density-Based Spatial Clustering grouping weak signals across assets.",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Detecting Weak Signals Before Release</h3>
            <p className="text-base text-slate-700 leading-relaxed font-normal">
              Most major industrial catastrophes are preceded by dozens of seemingly minor anomalies spread
              across different dates, teams, and operating assets. SurakshaAI employs <strong>HDBSCAN (Hierarchical Density-Based Spatial Clustering of Applications with Noise)</strong> over domain embeddings to automatically discover these recurring clusters without requiring manual tagging.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Metric 1</span>
              <h4 className="text-base font-bold text-slate-900">Cluster Coherence</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Measures the intra-cluster semantic density and mutual information across combined narratives.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Metric 2</span>
              <h4 className="text-base font-bold text-slate-900">Cross-Site Diffusion</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Detects whether a subtle unsafe act is spreading across multiple operating platforms or refineries.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Metric 3</span>
              <h4 className="text-base font-bold text-slate-900">Trend Acceleration</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Evaluates the rolling 30-day velocity of recurring events to flag INCREASING risk vectors.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "api-reference",
      category: "Integration & API",
      title: "REST API Endpoint Reference",
      badge: "OpenAPI 3.1",
      summary: "Complete programmatic interface for ingesting safety narratives and fetching triage decisions.",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Enterprise Integration Endpoints</h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              All endpoints require an <code>Authorization: Bearer &lt;TOKEN&gt;</code> header obtained from the authentication service.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { method: "POST", path: "/api/v1/auth/login", desc: "Authenticate analyst credentials & receive JWT token" },
              { method: "POST", path: "/api/v1/auth/register", desc: "Create an authorized HSE operational account" },
              { method: "GET", path: "/api/v1/reports", desc: "List safety incidents with multi-attribute filtering" },
              { method: "POST", path: "/api/v1/reports", desc: "Ingest narrative & execute 11-stage reasoning pipeline" },
              { method: "GET", path: "/api/v1/reports/{id}", desc: "Fetch complete report with entity spans and SHAP values" },
              { method: "GET", path: "/api/v1/triage", desc: "Query pending review tasks in the HSE queue" },
              { method: "POST", path: "/api/v1/triage/{id}/decision", desc: "Submit human review outcome (Confirm/Modify/Reject)" },
              { method: "GET", path: "/api/v1/precursors", desc: "Retrieve active recurring precursor clusters" },
              { method: "GET", path: "/api/v1/barriers", desc: "Inspect health and compromise rates of critical barriers" },
              { method: "GET", path: "/api/v1/trends", desc: "Fetch normalized longitudinal pSIF trajectories" },
            ].map((ep, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200/90 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-400 transition">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                    ep.method === "POST" ? "bg-emerald-100 text-emerald-800" : "bg-sky-100 text-sky-800"
                  }`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-sm font-bold text-slate-900">{ep.path}</span>
                </div>
                <span className="text-xs sm:text-sm text-slate-600 font-medium">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "code-examples",
      category: "Integration & API",
      title: "Code Integration Examples",
      badge: "cURL & Python SDK",
      summary: "Production-ready code snippets for integrating SurakshaAI into enterprise safety software.",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">Ingesting an Incident Narrative via cURL</h3>
            <p className="text-sm text-slate-500 font-medium mb-3">Execute directly from terminal or CI/CD pipelines:</p>
            <div className="relative rounded-2xl bg-slate-950 p-6 text-slate-200 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto shadow-md">
              <button
                onClick={() =>
                  handleCopy(
                    `curl -X POST http://localhost:8000/api/v1/reports \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <TOKEN>" \\
  -d '{
    "report_type": "NEAR_MISS",
    "narrative": "Technician started maintenance on compressor C-102 before confirming electrical isolation. No injury occurred.",
    "equipment": "Compressor C-102",
    "contractor_internal": "INTERNAL"
  }'`,
                    "curl"
                  )
                }
                className="absolute right-4 top-4 rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 flex items-center gap-1.5 transition"
              >
                {copiedKey === "curl" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === "curl" ? "Copied" : "Copy"}</span>
              </button>
              <pre>{`curl -X POST http://localhost:8000/api/v1/reports \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <TOKEN>" \\
  -d '{
    "report_type": "NEAR_MISS",
    "narrative": "Technician started maintenance on compressor C-102 before confirming electrical isolation. No injury occurred.",
    "equipment": "Compressor C-102",
    "contractor_internal": "INTERNAL"
  }'`}</pre>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">Python Automated Ingestion Script</h3>
            <p className="text-sm text-slate-500 font-medium mb-3">Sample Python client using requests:</p>
            <div className="relative rounded-2xl bg-slate-950 p-6 text-slate-200 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto shadow-md">
              <button
                onClick={() =>
                  handleCopy(
                    `import requests

API_URL = "http://localhost:8000/api/v1"

# 1. Authenticate
auth_resp = requests.post(f"{API_URL}/auth/login", json={
    "email": "analyst@suraksha.ai",
    "password": "Suraksha@2026"
})
token = auth_resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# 2. Ingest Safety Report
payload = {
    "report_type": "NEAR_MISS",
    "narrative": "Rigger stepped into mobile crane exclusion zone while 4T bundle was aloft.",
    "equipment": "Terex 50T Crane",
    "contractor_internal": "CONTRACTOR"
}
res = requests.post(f"{API_URL}/reports", json=payload, headers=headers)
report = res.json()
print(f"Report ID: {report['id']}")
print(f"pSIF Probability: {report['psif_probability']:.1%}")
print(f"Primary Barrier: {report['primary_barrier']}")`,
                    "python"
                  )
                }
                className="absolute right-4 top-4 rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 flex items-center gap-1.5 transition"
              >
                {copiedKey === "python" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === "python" ? "Copied" : "Copy"}</span>
              </button>
              <pre>{`import requests

API_URL = "http://localhost:8000/api/v1"

# 1. Authenticate
auth_resp = requests.post(f"{API_URL}/auth/login", json={
    "email": "analyst@suraksha.ai",
    "password": "Suraksha@2026"
})
token = auth_resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# 2. Ingest Safety Report
payload = {
    "report_type": "NEAR_MISS",
    "narrative": "Rigger stepped into mobile crane exclusion zone while 4T bundle was aloft.",
    "equipment": "Terex 50T Crane",
    "contractor_internal": "CONTRACTOR"
}
res = requests.post(f"{API_URL}/reports", json=payload, headers=headers)
report = res.json()
print(f"Report ID: {report['id']}")
print(f"pSIF Probability: {report['psif_probability']:.1%}")
print(f"Primary Barrier: {report['primary_barrier']}")`}</pre>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentSection = SECTIONS.find((s) => s.id === activeId) || SECTIONS[0];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/70 text-slate-900">
      <Navbar />

      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto space-y-10">
        {/* Authoritative Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3 py-0.5 text-xs font-bold text-slate-700">
              <Terminal className="h-3.5 w-3.5 text-sky-600" />
              <span>SurakshaAI Technical Documentation &amp; Standards v2.4</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Technical Documentation
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl leading-relaxed">
              Complete engineering manual covering the 11-stage safety reasoning state machine, calibrated pSIF algorithms, and private air-gapped APIs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 text-xs font-bold">
              ISO 45001 Aligned
            </span>
            <span className="rounded-full bg-sky-50 text-sky-800 border border-sky-200 px-3 py-1 text-xs font-bold">
              Zero Cloud Leakage
            </span>
          </div>
        </div>

        {/* 2-Column Documentation Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Rail */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block px-3">
                Documentation Modules
              </span>
              <nav className="space-y-2">
                {SECTIONS.map((sec) => {
                  const isActive = sec.id === activeId;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => setActiveId(sec.id)}
                      className={`w-full text-left p-4 rounded-2xl transition flex flex-col space-y-1 cursor-pointer ${
                        isActive
                          ? "bg-slate-900 text-white shadow-md"
                          : "hover:bg-slate-100/80 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold leading-tight">{sec.title}</span>
                        {sec.badge && (
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                              isActive
                                ? "bg-sky-500/20 text-sky-300 border border-sky-400/30"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {sec.badge}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-xs leading-relaxed line-clamp-2 ${
                          isActive ? "text-slate-300 font-normal" : "text-slate-500 font-normal"
                        }`}
                      >
                        {sec.summary}
                      </span>
                    </button>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  href="/app/dashboard"
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 p-3.5 text-sm font-bold text-slate-800 hover:bg-slate-200 transition"
                >
                  <span>Launch Live Platform</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Active Content Reader */}
          <article className="lg:col-span-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-1">
                    {currentSection.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {currentSection.title}
                  </h2>
                </div>
                {currentSection.badge && (
                  <span className="self-start sm:self-auto rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700">
                    {currentSection.badge}
                  </span>
                )}
              </div>

              {currentSection.content}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
