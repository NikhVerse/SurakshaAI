"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Presentation, ChevronRight, ArrowRight, ArrowLeft, CheckCircle2, Shield } from "lucide-react";

const DEMO_STEPS = [
  {
    step: 1,
    title: "1. Operational Executive Dashboard",
    desc: "Provides real-time visibility into precursor density, barrier failure rates, and high-priority triage queues across all operating facilities.",
    actionLink: "/app/dashboard",
    actionText: "Inspect Dashboard",
  },
  {
    step: 2,
    title: "2. The Deceptive Field Incident Narrative",
    desc: "Technician reports unverified electrical isolation during maintenance. Zero injuries realized, but extreme fatality precursor present.",
    actionLink: "/app/reports/new",
    actionText: "Inspect Intake Console",
  },
  {
    step: 3,
    title: "3. 11-Stage Critical-Risk Reasoning",
    desc: "Entities and energy states are extracted, flagging Energy Isolation as 'Unverified' with potential for fatal electric arc-flash.",
    actionLink: "/app/reports/REP-2026-001",
    actionText: "Inspect Signature Report",
  },
  {
    step: 4,
    title: "4. Calibrated pSIF Probability",
    desc: "Gradient-boosted decision trees calculate 91% pSIF probability and Priority Score 88.5 using Platt calibration.",
    actionLink: "/app/reports/REP-2026-001",
    actionText: "Inspect Calibrated Scores",
  },
  {
    step: 5,
    title: "5. Life-Saving Rules Multi-Labeling",
    desc: "Maps the incident into Energy Isolation (LSR-04) and Work Authorisation (LSR-08) with transparent supporting text spans.",
    actionLink: "/app/life-saving-rules",
    actionText: "Inspect LSR Mappings",
  },
  {
    step: 6,
    title: "6. Precursor Semantic Clustering",
    desc: "Unsupervised HDBSCAN groups recurring weak signals under 'PREC-001: Work Under Hazardous Energy' across assets.",
    actionLink: "/app/precursors/PREC-001",
    actionText: "Inspect Precursor Cluster",
  },
  {
    step: 7,
    title: "7. Grounded Retrieval-Augmented Safety",
    desc: "Cites mandatory clauses from Corporate Standard HSE-STD-014 and IOGP Report 459 for transparent auditability.",
    actionLink: "/app/knowledge",
    actionText: "Inspect Knowledge Sources",
  },
  {
    step: 8,
    title: "8. Human-in-the-Loop Expert Triage",
    desc: "Routes to the HSE Triage Queue where the Lead Analyst verifies classifications, locking immutable audit records.",
    actionLink: "/app/triage",
    actionText: "Inspect Triage Queue",
  },
];

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const step = DEMO_STEPS[currentStep];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Balanced Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Interactive Evaluation Tour
          </h1>
          <p className="text-sm sm:text-base font-medium text-slate-500 mt-1">
            Step-by-step walkthrough of the end-to-end SurakshaAI reasoning workflow
          </p>
        </div>
        <span className="rounded-xl bg-sky-50 text-sky-800 border border-sky-200 px-3 py-1 font-mono text-xs font-bold self-start sm:self-auto">
          Step {step.step} of {DEMO_STEPS.length}
        </span>
      </div>

      {/* Main Step Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
            Demonstration Stage
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">{step.title}</h2>
          <p className="text-sm text-slate-600 leading-relaxed font-normal max-w-2xl">
            {step.desc}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <Link
            href={step.actionLink}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 shadow-xs transition active:scale-[0.99]"
          >
            <span>{step.actionText}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:border-slate-400 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep((prev) => Math.min(DEMO_STEPS.length - 1, prev + 1))}
              disabled={currentStep === DEMO_STEPS.length - 1}
              className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-500 disabled:opacity-40 disabled:pointer-events-none shadow-xs transition cursor-pointer"
            >
              Next Stage
            </button>
          </div>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {DEMO_STEPS.map((s, idx) => (
          <button
            key={s.step}
            onClick={() => setCurrentStep(idx)}
            className={`rounded-xl border p-2 text-center transition cursor-pointer ${
              idx === currentStep
                ? "border-slate-900 bg-slate-900 text-white font-bold shadow-xs"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 font-semibold"
            }`}
          >
            <span className="block text-[10px] uppercase">Step</span>
            <span className="block text-sm">{s.step}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
