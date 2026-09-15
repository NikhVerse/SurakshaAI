import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Lock, Database } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/60 text-slate-900">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Header (Balanced H1) */}
          <div className="space-y-2 border-b border-slate-200 pb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-600">
              Data Privacy &amp; Integrity
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Privacy &amp; Data Handling Policy
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl leading-relaxed">
              Industrial data residency, air-gapped processing, and data ownership principles.
            </p>
          </div>

          {/* Core Privacy Cards (Balanced H3 Cards) */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 shadow-xs">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-base">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-200">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <span>Zero Cloud Leakage</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                SurakshaAI operates locally on private infrastructure. Incident descriptions, equipment tags, and contractor identities are never transmitted to third-party cloud services or public LLM APIs.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 shadow-xs">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-base">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <Database className="h-4.5 w-4.5" />
                </div>
                <span>Strict Provenance Tagging</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Every ingested record is permanently tagged with its origin (Production Authorized, Synthetic, or Expert Reviewed) to ensure demo data never contaminates enterprise audit records.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 shadow-xs">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-base">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <span>Immutable Compliance Audits</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                All triage decisions, barrier overrides, and model predictions are logged in tamper-evident append-only audit tables for regulatory compliance and institutional accountability.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
