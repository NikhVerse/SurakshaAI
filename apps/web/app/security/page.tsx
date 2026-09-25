import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, Cpu, Database, EyeOff, UserCheck } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/60 text-slate-900">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-10">
          {/* Header (Balanced H1) */}
          <div className="space-y-2 border-b border-slate-200 pb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-700">
              Security &amp; Compliance
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Security Architecture
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium max-w-3xl leading-relaxed">
              Air-gapped inference, prompt injection defense, and immutable audit trails for hazardous operations.
            </p>
          </div>

          {/* 4 Pillars of Security (Balanced H3 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs hover:border-slate-300 transition">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-base">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-200">
                  <Cpu className="h-5 w-5" />
                </div>
                <span>Decoupled Safety Architecture</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Safety narratives and contractor reports are protected by strict schema isolation and zero-data-retention OpenAI enterprise policies, backed by offline deterministic safety models.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs hover:border-slate-300 transition">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-base">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <Lock className="h-5 w-5" />
                </div>
                <span>Prompt Injection Defense</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Narratives are treated strictly as untrusted input. Risk scores are determined by deterministic feature extractors and calibrated ML, immune to prompt manipulation.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs hover:border-slate-300 transition">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-base">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                  <UserCheck className="h-5 w-5" />
                </div>
                <span>Role-Based Access Control</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Enforces distinct operational roles: HSE Lead Analyst, HSE Manager, Data Scientist, and System Administrator with backend JWT token verification.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs hover:border-slate-300 transition">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-base">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 border border-slate-300">
                  <Database className="h-5 w-5" />
                </div>
                <span>Immutable Audit Logging</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Every intake, triage decision, model execution, and document upload writes an immutable record with actor identity and timestamp for regulatory compliance.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
