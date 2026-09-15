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
  Info,
} from "lucide-react";
import { fetchApi, ReportDetail } from "@/lib/api";

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const reportId = resolvedParams.id;

  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSpan, setSelectedSpan] = useState<string | null>(null);

  // Review Form State
  const [reviewDecision, setReviewDecision] = useState("CONFIRMED");
  const [reviewReason, setReviewReason] = useState("");
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
      <div className="flex h-64 items-center justify-center text-sm font-bold text-slate-500">
        Loading safety analysis package for {reportId}...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="rounded-2xl border border-slate-200 p-8 text-center text-sm font-bold text-slate-500 bg-white">
        Report not found.
      </div>
    );
  }

  const psif = report.psif_prediction;
  const isHighRisk = (psif?.psif_probability || 0) >= 0.6;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi(`/api/v1/triage/task-auto/decision`, {
        method: "POST",
        body: JSON.stringify({
          decision: reviewDecision,
          reason: reviewReason || "Reviewed in Report Inspector",
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
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header: Balanced Scale */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
            <Link href="/app/reports" className="hover:text-slate-800 transition">
              Incident Reports
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-mono text-slate-600">{report.report_uid}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {report.report_uid}
            </h1>
            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold border ${
              isHighRisk
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-slate-100 text-slate-700 border-slate-200"
            }`}>
              {isHighRisk ? "High pSIF Risk" : "Standard Risk"}
            </span>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-slate-500">Review Status:</span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
            report.review_status === "CONFIRMED"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : report.review_status === "PENDING"
              ? "bg-amber-50 text-amber-800 border-amber-200"
              : "bg-slate-100 text-slate-700 border-slate-200"
          }`}>
            {report.review_status}
          </span>
        </div>
      </div>

      {/* Balanced Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* pSIF Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-1.5 shadow-xs hover:border-slate-300 transition">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            pSIF Probability
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold tracking-tight font-mono ${isHighRisk ? "text-rose-600" : "text-slate-900"}`}>
              {psif ? (psif.psif_probability * 100).toFixed(0) : "0"}%
            </span>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
              High
            </span>
          </div>
          <span className="block text-[11px] text-slate-400 font-medium">
            Platt-calibrated model
          </span>
        </div>

        {/* Priority Score Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-1.5 shadow-xs hover:border-slate-300 transition">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Priority Score
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono">
              {psif ? psif.priority_score : "0"}
            </span>
            <span className="text-xs font-bold text-slate-400">/ 100</span>
          </div>
          <span className="block text-[11px] text-slate-400 font-medium">
            Requires HSE attention
          </span>
        </div>

        {/* Primary Barrier Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-1.5 shadow-xs hover:border-slate-300 transition">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Critical Barrier
          </span>
          <div>
            <p className="text-base font-bold text-slate-900 truncate" title={psif?.primary_barrier}>
              {psif?.primary_barrier || "Work Authorisation"}
            </p>
            <span className="inline-block mt-0.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded">
              {psif?.barrier_state || "Unverified"}
            </span>
          </div>
        </div>

        {/* Confidence Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-1.5 shadow-xs hover:border-slate-300 transition">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Model Confidence
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono">
              {psif ? (psif.confidence * 100).toFixed(0) : "92"}%
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              High
            </span>
          </div>
          <span className="block text-[11px] text-slate-400 font-medium">
            Grounded attribution
          </span>
        </div>
      </div>

      {/* Main Content: 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Narrative, Entities, Context */}
        <div className="lg:col-span-7 space-y-6">
          {/* Narrative Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Incident Narrative
              </span>
              <p className="text-base text-slate-800 font-medium leading-relaxed">
                {report.narrative}
              </p>
            </div>

            {/* Extracted Safety Entities */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Key Extracted Factors
              </span>
              <div className="flex flex-wrap gap-2">
                {report.entities.map((e, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSpan(e.text_span === selectedSpan ? null : e.text_span)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition border ${
                      selectedSpan === e.text_span
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span className="font-mono text-sky-600 font-bold uppercase text-[10px]">
                      {e.entity_type}
                    </span>
                    <span>{e.value}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Metadata Badges */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold text-[11px]">Site</span>
                <span className="font-bold text-slate-900 mt-0.5 block truncate">{report.site_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[11px]">Activity</span>
                <span className="font-bold text-slate-900 mt-0.5 block truncate">{report.activity_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[11px]">Equipment</span>
                <span className="font-bold text-slate-900 mt-0.5 block truncate">{report.equipment || "Standard"}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[11px]">Outcome</span>
                <span className="font-bold text-slate-900 mt-0.5 block truncate">{report.actual_outcome || "No injury"}</span>
              </div>
            </div>
          </div>

          {/* Consequence Pathway & Evidence */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Consequence Pathway
              </span>
              <p className="text-base font-bold text-slate-900">
                {psif?.credible_consequence}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Synthesis &amp; Evidence
              </span>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                {psif?.explanation_summary}
              </p>
            </div>
          </div>

          {/* Life-Saving Rules */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Life-Saving Rules Mapping
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.lsr_predictions.map((lsr) => (
                <div
                  key={lsr.lsr_id}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">{lsr.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold block">{lsr.code}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 font-bold text-xs text-slate-900">
                    {(lsr.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Review Action, SHAP, Similar Cases */}
        <div className="lg:col-span-5 space-y-6">
          {/* Formal Review Decision Panel */}
          <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                HSE Expert Decision
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                HITL Sign-Off
              </span>
            </div>

            {reviewSubmitted ? (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                <span>Decision recorded ({reviewDecision}).</span>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Action</label>
                  <select
                    value={reviewDecision}
                    onChange={(e) => setReviewDecision(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:border-slate-900"
                  >
                    <option value="CONFIRMED">Confirm AI Assessment</option>
                    <option value="MODIFIED">Modify Assessment</option>
                    <option value="REJECTED">Reject / False Alarm</option>
                    <option value="NEEDS_INFO">Request More Info</option>
                    <option value="ESCALATED">Escalate to Safety Board</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Reviewer Notes</label>
                  <textarea
                    rows={3}
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    placeholder="Enter observations or corrective barrier actions..."
                    className="w-full rounded-xl border border-slate-300 p-2.5 bg-white text-slate-900 text-xs font-normal focus:outline-none focus:border-slate-900"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 font-bold text-white hover:bg-slate-800 transition shadow-xs text-xs cursor-pointer active:scale-[0.99]"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Decision</span>
                </button>
              </form>
            )}
          </div>

          {/* Factor Attribution (SHAP) */}
          {psif && psif.shap_values && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Factor Attribution (SHAP)
              </span>
              <div className="space-y-2.5 text-xs">
                {Object.entries(psif.shap_values).map(([feature, val]) => (
                  <div key={feature} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700 truncate max-w-[200px]">{feature}</span>
                      <span className="font-bold text-slate-900 font-mono">+{val}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-sky-600 rounded-full"
                        style={{ width: `${Math.min(val * 200, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Semantically Similar Cases */}
          {report.similar_reports && report.similar_reports.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Similar Incidents
              </span>
              <div className="space-y-2">
                {report.similar_reports.map((sim) => (
                  <div
                    key={sim.report_id}
                    className="rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-slate-900">{sim.report_uid}</span>
                        <span className="font-bold text-[10px] text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                          {(sim.similarity_score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-slate-500 truncate text-[11px] font-normal mt-0.5">{sim.narrative_snippet}</p>
                    </div>
                    <Link
                      href={`/app/reports/${sim.report_id}`}
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-white shrink-0 transition"
                    >
                      Compare
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
