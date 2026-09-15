import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Layers, UserCheck } from "lucide-react";
import Link from "next/link";

const CORE_STAGES = [
  {
    step: "01",
    title: "Narrative Ingestion & Entity Parsing",
    summary: "Parses safety text into verified entities: hazards, energy sources, equipment, and worker exposure.",
    badge: "Air-Gapped NLP",
  },
  {
    step: "02",
    title: "Critical Barrier Health Assessment",
    summary: "Evaluates incident against control barriers (Isolation, Gas Testing, Line of Fire) to detect degraded states.",
    badge: "IOGP Aligned",
  },
  {
    step: "03",
    title: "Calibrated Risk & Precursor Clustering",
    summary: "Platt-scaled models compute mathematical pSIF probabilities while HDBSCAN identifies recurring weak signals.",
    badge: "PR-AUC: 0.88",
  },
  {
    step: "04",
    title: "Human-in-the-Loop Triage & Sign-Off",
    summary: "High-priority incidents route to qualified HSE experts for human verification before actions are locked.",
    badge: "Immutable Audit",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/60 text-slate-900">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-10">
          {/* Header (Balanced H1) */}
          <div className="space-y-2 border-b border-slate-200 pb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-700">
              Methodology
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              How SurakshaAI Works
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium max-w-3xl leading-relaxed">
              Four-stage explainable pipeline separating calibrated mathematical risk calculation from narrative synthesis.
            </p>
          </div>

          {/* 4 Balanced Stages (H3 & Body) */}
          <div className="space-y-4">
            {CORE_STAGES.map((s) => (
              <div
                key={s.step}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:border-slate-300 transition"
              >
                <div className="flex items-start gap-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sky-400 font-mono font-bold text-base shadow-xs">
                    {s.step}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">{s.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal max-w-2xl">
                      {s.summary}
                    </p>
                  </div>
                </div>
                <span className="self-start sm:self-auto shrink-0 rounded-lg bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700">
                  {s.badge}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Action Card (Balanced Scale) */}
          <div className="rounded-2xl border border-slate-900 bg-slate-900 text-white p-8 text-center space-y-4 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Experience the Pipeline in Action
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
              Test safety incident narratives and inspect real-time pSIF predictions in the operational console.
            </p>
            <div className="pt-2">
              <Link
                href="/app/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-100 transition shadow-sm active:scale-[0.99]"
              >
                <span>Launch Operational Console</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
