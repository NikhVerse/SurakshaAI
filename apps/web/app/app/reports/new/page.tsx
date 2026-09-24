"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { fetchApi, ReportDetail } from "@/lib/api";

export default function NewReportPage() {
  const router = useRouter();
  const [narrative, setNarrative] = useState("");
  const [reportType, setReportType] = useState("NEAR_MISS");
  const [equipment, setEquipment] = useState("");
  const [contractorInternal, setContractorInternal] = useState("INTERNAL");
  const [actualOutcome, setActualOutcome] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!narrative.trim()) {
      setError("Please provide an incident narrative description.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetchApi<ReportDetail>("/api/v1/reports", {
        method: "POST",
        body: JSON.stringify({
          narrative: narrative.trim(),
          report_type: reportType,
          equipment: equipment.trim() || undefined,
          contractor_internal: contractorInternal,
          actual_outcome: actualOutcome.trim() || undefined,
          data_origin: "DIRECT_ENTRY",
        }),
      });

      if (res && res.id) {
        router.push(`/app/reports/${res.id}`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to intake and analyze report narrative");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <Link
          href="/app/reports"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Incidents</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
          Incident Intake Console
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Submit field observations, near-misses, or unsafe acts for automated pSIF and barrier evaluation
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Intake Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Incident Narrative <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={5}
            required
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            className="w-full rounded-xl border border-slate-300 p-3.5 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-slate-900 leading-relaxed transition"
            placeholder="Provide a factual narrative of what occurred, equipment involved, work being performed, and barrier conditions observed..."
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 bg-white text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-900 cursor-pointer"
            >
              <option value="NEAR_MISS">Near Miss</option>
              <option value="UNSAFE_ACT">Unsafe Act</option>
              <option value="UNSAFE_CONDITION">Unsafe Condition</option>
              <option value="INCIDENT">Minor Incident</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Equipment / Asset
            </label>
            <input
              type="text"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              placeholder="e.g. Reciprocating Compressor K-101"
              className="w-full rounded-xl border border-slate-300 p-2.5 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Personnel Exposure
            </label>
            <select
              value={contractorInternal}
              onChange={(e) => setContractorInternal(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 bg-white text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-900 cursor-pointer"
            >
              <option value="INTERNAL">Company Personnel</option>
              <option value="CONTRACTOR">Contractor Personnel</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Observed Outcome / Immediate Actions
          </label>
          <input
            type="text"
            value={actualOutcome}
            onChange={(e) => setActualOutcome(e.target.value)}
            placeholder="e.g. Work halted immediately. No injuries sustained."
            className="w-full rounded-xl border border-slate-300 p-2.5 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          <span className="text-[11px] text-slate-400 font-medium">
            Automated entity extraction, pSIF probability &amp; IOGP barrier mapping
          </span>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50 shadow-2xs cursor-pointer"
          >
            <span>{loading ? "Analyzing..." : "Submit for Evaluation"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
