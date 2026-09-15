import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/60 text-slate-900">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-10">
          {/* Header (Balanced H1) */}
          <div className="space-y-2 border-b border-slate-200 pb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-700">
              Governance &amp; Purpose
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              About SurakshaAI
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium max-w-3xl leading-relaxed">
              Explainable critical-risk intelligence detecting catastrophic precursors in heavy industry.
            </p>
          </div>

          {/* The Core Challenge (Balanced H2) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Shift from Lagging Injuries to Leading Precursors
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Low minor-injury rates often mask catastrophic hazards. Major industrial accidents are almost always preceded by weak signals—unverified isolations, bypassed interlocks, and line-of-fire breaches. SurakshaAI transforms unstructured incident narratives into calibrated critical barrier intelligence.
            </p>
          </div>

          {/* Deliverables vs Safety Boundaries (Balanced H3 & H4) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-base">
                <CheckCircle2 className="h-5 w-5" />
                <span>What SurakshaAI Delivers</span>
              </div>
              <ul className="text-sm text-slate-600 space-y-3 font-normal leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                  <span>Extracts energy hazards and critical barrier states from narrative text.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                  <span>Calibrates mathematical pSIF probabilities using gradient boosted trees.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                  <span>Maps incident records directly to the 9 IOGP Life-Saving Rules.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                  <span>Discovers recurring precursor clusters across operating assets.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-amber-800 font-bold text-base">
                <AlertTriangle className="h-5 w-5" />
                <span>Safety Boundaries</span>
              </div>
              <ul className="text-sm text-slate-700 space-y-3 font-normal leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                  <span>Does NOT claim to predict exact accident timing or physical location.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                  <span>Never replaces qualified field supervisors or certified safety engineers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                  <span>Enforces human review before safety actions are dispatched.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                  <span>Maintains zero cloud data exposure with sovereign local models.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
