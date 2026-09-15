"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FilePlus, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { fetchApi, ReportDetail } from "@/lib/api";

const DEMO_PRESET_1 = "During maintenance of a compressor, the technician started work before confirming that electrical isolation was effective. No injury occurred.";
const DEMO_PRESET_2 = "While lifting a 4-tonne drill collar bundle with the mobile crane, the rigger walked directly under the suspended load to adjust the nylon sling. No load slip occurred.";
const DEMO_PRESET_3 = "Technicians entering flash vessel V-301 after lunch break did not conduct atmospheric gas testing. Multi-gas detector had been turned off in the tool shed.";

export default function NewReportPage() {
  const router = useRouter();
  const [narrative, setNarrative] = useState(DEMO_PRESET_1);
  const [reportType, setReportType] = useState("NEAR_MISS");
  const [equipment, setEquipment] = useState("Compressor Unit C-102");
  const [contractorInternal, setContractorInternal] = useState("INTERNAL");
  const [actualOutcome, setActualOutcome] = useState("No injury occurred. Maintenance halted upon lead supervisor discovery.");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetchApi<ReportDetail>("/api/v1/reports", {
        method: "POST",
        body: JSON.stringify({
          narrative,
          report_type: reportType,
          equipment,
          contractor_internal: contractorInternal,
          actual_outcome: actualOutcome,
          data_origin: "SYNTHETIC",
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
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Balanced Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          New Incident Intake
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
          Submit safety event narrative for critical precursor classification and barrier validation
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-800">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Preset Scenarios */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Preset Demonstration Scenarios
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => {
              setNarrative(DEMO_PRESET_1);
              setEquipment("Compressor Unit C-102");
              setActualOutcome("No injury occurred. Maintenance halted upon lead supervisor discovery.");
            }}
            className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-slate-400 hover:shadow-xs transition space-y-1.5 cursor-pointer"
          >
            <p className="font-bold text-sm text-slate-900">1. Compressor Isolation</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unverified electrical isolation before technician maintenance
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setNarrative(DEMO_PRESET_2);
              setEquipment("Terex 50T Crane");
              setActualOutcome("Load landed safely. Rigger reprimanded on scene.");
            }}
            className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-slate-400 hover:shadow-xs transition space-y-1.5 cursor-pointer"
          >
            <p className="font-bold text-sm text-slate-900">2. Crane Line of Fire</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rigger walked under 4T suspended load to adjust nylon sling
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setNarrative(DEMO_PRESET_3);
              setEquipment("Flash Vessel V-301");
              setActualOutcome("Entry stopped by plant operator before vessel hatch crossing.");
            }}
            className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-slate-400 hover:shadow-xs transition space-y-1.5 cursor-pointer"
          >
            <p className="font-bold text-sm text-slate-900">3. Confined Vessel Entry</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Entry without atmospheric gas testing or detector verification
            </p>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Safety Incident Narrative <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={4}
            required
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            className="w-full rounded-xl border border-slate-300 p-4 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-slate-900 leading-relaxed transition"
            placeholder="Describe what occurred, who was exposed, and equipment involved..."
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Category</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:border-slate-900 cursor-pointer"
            >
              <option value="NEAR_MISS">Near Miss</option>
              <option value="UNSAFE_ACT">Unsafe Act</option>
              <option value="UNSAFE_CONDITION">Unsafe Condition</option>
              <option value="INCIDENT">Minor Incident</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Equipment</label>
            <input
              type="text"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              placeholder="e.g. Reciprocating Compressor"
              className="w-full rounded-xl border border-slate-300 p-2.5 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Personnel</label>
            <select
              value={contractorInternal}
              onChange={(e) => setContractorInternal(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:border-slate-900 cursor-pointer"
            >
              <option value="INTERNAL">Internal Employee</option>
              <option value="CONTRACTOR">Contractor Staff</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Observed Outcome</label>
          <input
            type="text"
            value={actualOutcome}
            onChange={(e) => setActualOutcome(e.target.value)}
            placeholder="e.g. No injury occurred. Maintenance halted."
            className="w-full rounded-xl border border-slate-300 p-2.5 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-100">
          <span className="text-xs text-slate-400 font-medium">
            Calibrated Risk Model + Entity Parsing
          </span>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50 shadow-sm cursor-pointer active:scale-[0.99]"
          >
            <span>{loading ? "Analyzing Incident..." : "Analyze Incident"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
