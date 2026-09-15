import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/60 text-slate-900">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Header (Balanced H1) */}
          <div className="space-y-2 border-b border-slate-200 pb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-600">
              Governance &amp; Terms
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Terms of Use &amp; Safety Disclaimer
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl leading-relaxed">
              Industrial decision-support guidelines and operational responsibilities.
            </p>
          </div>

          {/* Safety Notice Callout */}
          <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-5 flex items-start gap-4 shadow-xs">
            <AlertTriangle className="h-6 w-6 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h2 className="text-base font-bold text-amber-900">Safety Decision-Support Only</h2>
              <p className="text-sm text-amber-800 font-normal leading-relaxed">
                SurakshaAI is an engineering decision-support tool. It assists qualified HSE professionals and does not replace human safety judgment or statutory compliance procedures.
              </p>
            </div>
          </div>

          {/* Core Principles (Balanced H3 Cards) */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 shadow-xs">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">1. Human Accountability</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Certified human HSE personnel retain sole authority and responsibility for site authorizations, permit approvals, and critical barrier interventions.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 shadow-xs">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">2. Calibrated Mathematical Risk</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Risk indicators, pSIF calculations, and Life-Saving Rule classifications are mathematical estimates derived from narrative patterns and historical data distributions.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 shadow-xs">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">3. Sovereign Data Governance</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Datasets loaded into this deployment are governed strictly within on-premises or sovereign infrastructure boundaries in full compliance with corporate data residency requirements.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
