"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HelpCircle, AlertCircle, Send, CheckCircle2 } from "lucide-react";

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/60 text-slate-900">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-10">
          {/* Header (Balanced H1) */}
          <div className="space-y-2 border-b border-slate-200 pb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-700">
              Assistance &amp; Diagnostics
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Support &amp; Troubleshooting
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl leading-relaxed">
              Operational troubleshooting, telemetry diagnostics, and engineering assistance.
            </p>
          </div>

          {/* Quick FAQ Cards (Balanced H3 Cards) */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Operational FAQs</h2>
            <div className="space-y-3">
              {[
                {
                  q: "What does 'Degraded Fallback' mean?",
                  a: "If the OpenAI API key is unconfigured or during offline mode, deterministic ML and rule-based safety extraction remain 100% active. Risk calculations and human triage workflows continue without interruption."
                },
                {
                  q: "Why is an incident with no physical injuries flagged as High pSIF?",
                  a: "SurakshaAI evaluates potential catastrophic consequence, not just realized injury. High-voltage exposure or unverified crane loads carry severe fatality potential regardless of lucky outcomes."
                },
                {
                  q: "Are incident narratives securely processed?",
                  a: "AI reasoning interfaces exclusively with OpenAI GPT-4o through zero-data-retention enterprise API endpoints, backed by deterministic offline fallback safety models."
                }
              ].map((faq, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-1.5 shadow-xs hover:border-slate-300 transition">
                  <h3 className="font-bold text-sm text-slate-900">{faq.q}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Support Ticket Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Submit Support Ticket</h2>
            {submitted ? (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-bold text-emerald-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Ticket registered successfully. Internal reference: TKT-2026-0941.</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Issue Category</label>
                    <select className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-medium bg-white text-slate-900 focus:outline-none focus:border-slate-900 transition">
                      <option>Narrative Analysis &amp; Extraction</option>
                      <option>OpenAI API Connectivity &amp; Quotas</option>
                      <option>Knowledge Document Ingestion</option>
                      <option>Triage Review Workflow</option>
                      <option>Security &amp; Audit Logs</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Severity Level</label>
                    <select className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-medium bg-white text-slate-900 focus:outline-none focus:border-slate-900 transition">
                      <option>Low — Operational Guidance</option>
                      <option>Medium — Feature Impairment</option>
                      <option>High — Triage Critical Block</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief description of the diagnostic issue"
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Details &amp; Observed Behavior</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide incident report ID, steps to reproduce, or error messages..."
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm font-normal leading-relaxed text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900 transition"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 shadow-sm cursor-pointer active:scale-[0.99]"
                >
                  <span>Dispatch Ticket</span>
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
