import Link from "next/link";
import { Shield, AlertCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 text-sky-400">
                <Shield className="h-3.5 w-3.5" />
              </div>
              <span className="font-semibold text-slate-900">SurakshaAI</span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono text-slate-600">
                v1.0-enterprise
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Explainable industrial safety critical-risk intelligence decision-support platform.
              Designed for Health, Safety, and Environment (HSE) organizations to transform unstructured
              incident narratives into calibrated pSIF priorities, barrier health analytics, and recurring precursor discovery.
            </p>
            <div className="flex items-start gap-2 rounded border border-amber-200 bg-amber-50/50 p-2 text-[12px] text-amber-800">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" />
              <span>
                <strong>Non-Negotiable Boundary:</strong> SurakshaAI is a decision-support platform, not an accident predictor or autonomous authority.
                Final safety decisions and interventions remain the responsibility of qualified human HSE professionals.
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Platform & Architecture
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-slate-900">About & Methodology</Link></li>
              <li><Link href="/how-it-works" className="hover:text-slate-900">Reasoning Pipeline</Link></li>
              <li><Link href="/security" className="hover:text-slate-900">Private AI & Security</Link></li>
              <li><Link href="/docs" className="hover:text-slate-900">API Documentation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Support & Governance
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/support" className="hover:text-slate-900">Help & Troubleshooting</Link></li>
              <li><Link href="/contact" className="hover:text-slate-900">Contact Team</Link></li>
              <li><Link href="/privacy" className="hover:text-slate-900">Data Minimization</Link></li>
              <li><Link href="/terms" className="hover:text-slate-900">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-[12px] text-slate-400 gap-2">
          <span>&copy; {new Date().getFullYear()} SurakshaAI Project. Built for SIH Problem Statement SIH26165.</span>
          <span className="font-mono">Engineered for Zero Cloud Dependency</span>
        </div>
      </div>
    </footer>
  );
}
