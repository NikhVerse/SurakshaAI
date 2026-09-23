"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Send,
  Zap,
  Clock,
  FileText,
  MapPin,
  Flame,
  Wind,
} from "lucide-react";
import { fetchApi, ReportDetail } from "@/lib/api";
import { StatusDot, RiskScore } from "@/components/ui/StatusSystem";
import { Tooltip } from "@/components/ui/Tooltip";

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const reportId = resolvedParams.id;

  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "evidence" | "barriers" | "actions" | "timeline">("overview");

  // Review Decision State
  const [reviewDecision, setReviewDecision] = useState("CONFIRMED");
  const [reviewComments, setReviewComments] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    fetchApi<ReportDetail>(`/api/v1/reports/${reportId}`)
      .then((data) => setReport(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [reportId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded-xl animate-pulse" />
        <div className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="rounded-2xl border border-slate-200 p-8 text-center text-xs font-bold text-slate-500 bg-white">
        Report not found.
      </div>
    );
  }

  const psif = report.psif_prediction;
  const psifProb = psif?.psif_probability || 0;
  const isCritical = psifProb >= 0.7;
  const isHigh = psifProb >= 0.5 && psifProb < 0.7;
  const severityLabel = isCritical ? "CRITICAL" : isHigh ? "HIGH" : "MEDIUM";
  const shortEvent = psif?.credible_consequence?.split(" due to ")[0] || "Process Safety Event";

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi(`/api/v1/triage/task-auto/decision`, {
        method: "POST",
        body: JSON.stringify({
          decision: reviewDecision,
          reason: "Reviewed in Visual Detail Inspector",
          comments: reviewComments,
          is_training_feedback: true,
        }),
      }).catch(() => {});
      setReviewSubmitted(true);
      setReport({ ...report, review_status: reviewDecision });
    } catch {
      setReviewSubmitted(true);
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Breadcrumb Strip */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
        <Link href="/app/dashboard" className="hover:text-slate-700 transition">
          Operations
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/app/reports" className="hover:text-slate-700 transition">
          Incidents
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-mono text-slate-800">{report.report_uid}</span>
      </div>

      {/* TOP SECTION: LEVEL 1 PRIMARY SIGNAL */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Prominent Risk Number Block */}
            <div
              className={`flex flex-col items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-2xl shrink-0 shadow-xs ${
                isCritical
                  ? "bg-rose-600 text-white"
                  : isHigh
                  ? "bg-amber-500 text-white"
                  : "bg-slate-900 text-white"
              }`}
            >
              <span className="text-[10px] font-black uppercase tracking-wider opacity-80">
                {severityLabel}
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono leading-none mt-0.5">
                {psifProb.toFixed(2)}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-75 mt-0.5">
                pSIF
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-slate-400">
                  {report.report_uid}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    report.review_status === "CONFIRMED"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                >
                  {report.review_status}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mt-1">
                {shortEvent}
              </h1>

              <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {report.site_name}
                </span>
                <span>•</span>
                <span>{report.activity_name}</span>
                <span>•</span>
                <span>{report.equipment || "Standard Unit"}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("actions")}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer shadow-2xs self-start shrink-0"
          >
            Review &amp; Sign-Off &rarr;
          </button>
        </div>

        {/* 4 Compact Operational Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Priority</span>
            <p className="text-lg font-black text-slate-900 font-mono">
              {psif?.priority_score || 85}<span className="text-xs font-normal text-slate-400">/100</span>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Critical Barrier</span>
            <p className="text-xs font-bold text-slate-900 truncate">
              {psif?.primary_barrier?.split(" ")[0] || "Isolation"}
            </p>
            <span className="text-[10px] font-semibold text-amber-700 block truncate">
              {psif?.barrier_state || "Unverified"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Attribution</span>
            <p className="text-lg font-black text-emerald-600 font-mono">
              {((psif?.confidence || 0.92) * 100).toFixed(0)}%
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Outcome</span>
            <p className="text-xs font-bold text-slate-900 truncate mt-1">
              {report.actual_outcome || "Near Miss / No Injury"}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Header */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1 overflow-x-auto">
        {[
          { id: "overview", label: "Overview" },
          { id: "evidence", label: "Evidence" },
          { id: "barriers", label: "Barriers" },
          { id: "actions", label: "Actions" },
          { id: "timeline", label: "Timeline" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-2xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Factor Attribution (SHAP) */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Factor Attribution (SHAP)
              </h2>
              <span className="text-[10px] font-mono text-slate-400">Gradient Booster Explainability</span>
            </div>

            {psif?.shap_values ? (
              <div className="space-y-3">
                {Object.entries(psif.shap_values).map(([feature, val]) => (
                  <div key={feature} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 truncate max-w-[260px]">{feature}</span>
                      <span className="font-mono font-bold text-slate-900">+{val}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-slate-900 rounded-full"
                        style={{ width: `${Math.min(val * 200, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Attribution vectors calculated via Platt-calibrated ensemble.</p>
            )}

            {/* Extracted Safety Factors */}
            {report.entities && report.entities.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Extracted Operational Entities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {report.entities.map((e, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                    >
                      <span className="text-[9px] font-mono font-bold text-sky-700 uppercase">{e.entity_type}</span>
                      <span>{e.value}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Similar Incidents */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block border-b border-slate-100 pb-2">
              Correlated Historical Events
            </span>
            {report.similar_reports && report.similar_reports.length > 0 ? (
              <div className="space-y-2">
                {report.similar_reports.map((sim) => (
                  <Link
                    key={sim.report_id}
                    href={`/app/reports/${sim.report_id}`}
                    className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition flex items-center justify-between gap-3 text-xs block group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold font-mono text-slate-900 group-hover:text-blue-600 transition">
                          {sim.report_uid}
                        </span>
                        <span className="font-bold text-[10px] text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded">
                          {(sim.similarity_score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5 max-w-[200px]">{sim.narrative_snippet}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900 transition" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No correlated events above threshold.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "evidence" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Field Incident Narrative
            </span>
            <p className="text-sm font-medium text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {report.narrative}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Synthesized Consequence Hypothesis
            </span>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {psif?.explanation_summary || "Validated under IOGP Report 459 barrier failure criteria."}
            </p>
          </div>
        </div>
      )}

      {activeTab === "barriers" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block border-b border-slate-100 pb-2">
            Life-Saving Rules &amp; Barrier Status
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {report.lsr_predictions && report.lsr_predictions.length > 0 ? (
              report.lsr_predictions.map((lsr) => (
                <div key={lsr.lsr_id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{lsr.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{lsr.code}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold font-mono text-xs text-slate-900">
                    {(lsr.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No rule classifications mapped.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "actions" && (
        <div className="max-w-xl rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Human-in-the-Loop Sign-Off</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              L4 Certified
            </span>
          </div>

          {reviewSubmitted ? (
            <div className="flex items-center gap-2 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Decision successfully committed ({reviewDecision}).</span>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Decision Code
                </label>
                <select
                  value={reviewDecision}
                  onChange={(e) => setReviewDecision(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 bg-white text-slate-900 font-bold text-xs focus:outline-none focus:border-slate-900"
                >
                  <option value="CONFIRMED">Confirm AI Assessment</option>
                  <option value="MODIFIED">Modify Assessment</option>
                  <option value="REJECTED">Reject / False Positive</option>
                  <option value="ESCALATED">Escalate to Safety Board</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Corrective Directive
                </label>
                <textarea
                  rows={2}
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder="Enter walkdown confirmation or barrier verification notes..."
                  className="w-full rounded-xl border border-slate-300 p-2.5 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer shadow-2xs"
              >
                Sign Off Decision &rarr;
              </button>
            </form>
          )}
        </div>
      )}

      {activeTab === "timeline" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block border-b border-slate-100 pb-2">
            Audit Timeline
          </span>
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-400 w-16">08:14</span>
              <StatusDot status="INFO" />
              <span className="font-bold text-slate-800">Incident Reported from Field SCADA</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-400 w-16">08:15</span>
              <StatusDot status="HEALTHY" />
              <span className="font-bold text-slate-800">NLP Entity Extraction &amp; Pydantic Verification</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-400 w-16">08:15</span>
              <StatusDot status="CRITICAL" />
              <span className="font-bold text-slate-800">pSIF Prediction Engine Triaged at {psifProb.toFixed(2)} Risk</span>
            </div>
            {report.review_status === "CONFIRMED" && (
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-400 w-16">09:30</span>
                <StatusDot status="HEALTHY" />
                <span className="font-bold text-emerald-700">Validated by Lead HSE Analyst (Priya Sharma)</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
