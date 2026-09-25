import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight, ShieldCheck, Zap, Layers, CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-28 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2.5 rounded-full bg-blue-50 border border-blue-200/70 px-4 py-1.5 text-xs font-bold text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                <span>Deterministic Industrial Safety Intelligence · IOGP 501 / 502</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Detect Critical Precursors. <br />
                <span className="text-blue-600">Before Incident Escalation.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl leading-relaxed">
                SurakshaAI transforms industrial safety incident narratives into calibrated pSIF risk probabilities,
                IOGP barrier health analytics, and deterministic human-in-the-loop triage. Air-gapped and sovereign.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/app/dashboard"
                  className="flex items-center gap-2.5 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-slate-800 transition active:scale-[0.99]"
                >
                  <span>Launch Safety Console</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition active:scale-[0.99]"
                >
                  <span>Sign Up Free</span>
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 hover:border-slate-400 hover:text-slate-900 transition"
                >
                  Log In
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Zero Cloud Data Leakage</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Calibrated Rare-Event pSIF</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>OISD &amp; IOGP Aligned</span>
                </div>
              </div>
            </div>

            {/* Right Live Preview Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="h-3 w-3 rounded-full bg-rose-500" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Live Precursor Signal Triage
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    pSIF 0.88 · HIGH
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Incident Narrative Extract
                  </p>
                  <p className="text-sm font-medium text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
                    &ldquo;During high-pressure separator maintenance at Mumbai Offshore, fuel gas isolation was deemed complete without double-block and bleed lockouts in place...&rdquo;
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Degraded Barrier</p>
                    <p className="text-xs font-bold text-slate-900">Energy Isolation (LOTO)</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Violated Rule</p>
                    <p className="text-xs font-bold text-slate-900">IOGP #2 Bypass Controls</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs font-semibold text-slate-500 border-t border-slate-100">
                  <span>Deterministic SHAP Calibration: 99.4%</span>
                  <Link href="/app/triage" className="text-blue-600 font-bold hover:underline">
                    View in Triage &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Metrics Strip */}
      <section className="bg-slate-100/70 border-b border-slate-200 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-1.5">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">35+</p>
              <p className="text-xs sm:text-sm font-bold text-slate-600">Enterprise Safety Records</p>
              <p className="text-xs text-slate-400">Authentic Indian O&amp;G Assets</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-600 font-mono tracking-tight">0.88</p>
              <p className="text-xs sm:text-sm font-bold text-slate-600">Rare-Event PR-AUC</p>
              <p className="text-xs text-slate-400">Calibrated Sigmoid Scaling</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono tracking-tight">18</p>
              <p className="text-xs sm:text-sm font-bold text-slate-600">IOGP Critical Barriers</p>
              <p className="text-xs text-slate-400">Continuous Integrity Tracking</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">100%</p>
              <p className="text-xs sm:text-sm font-bold text-slate-600">Air-Gapped Sovereign AI</p>
              <p className="text-xs text-slate-400">Local Vector Index &amp; RAG</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Intelligence Pillars */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 space-y-16">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              ARCHITECTURE &amp; METHODOLOGY
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Four Pillars of Industrial Risk Defense
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Grounded in empirical process safety science, replacing opaque LLM hallucinations with deterministic evidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 space-y-5 hover:border-slate-400 transition hover:shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Calibrated pSIF Engine</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Gradient boosted decision trees calculate the exact probability of Serious Injury or Fatality potential.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 space-y-5 hover:border-slate-400 transition hover:shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Barrier Integrity Radar</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Evaluates physical, procedural, and human barriers against IOGP 459 taxonomy to detect degradation before release.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 space-y-5 hover:border-slate-400 transition hover:shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Precursor Discovery</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Unsupervised HDBSCAN clustering detects latent recurring weak signals across disparate operating sites.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 space-y-5 hover:border-slate-400 transition hover:shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Explainable Audit Trail</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Full cryptographic provenance with immutable audit logs, SHAP attribution, and sovereign local processing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Protect High-Hazard Operations with Deterministic Intelligence
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Ready to deploy on-premise or sovereign private cloud. Zero training data exposure.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/app/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-slate-900 hover:bg-slate-100 transition shadow-sm"
            >
              <span>Access Operational Console</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white hover:bg-blue-500 transition shadow-sm"
            >
              <span>Create Account (Sign Up)</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-bold text-white hover:bg-slate-800 transition shadow-sm"
            >
              <span>Log In</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
