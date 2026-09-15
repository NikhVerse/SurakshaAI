"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/60 text-slate-900">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-10">
          {/* Header (Balanced H1) */}
          <div className="space-y-2 border-b border-slate-200 pb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-700">
              Get in Touch
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Contact Engineering
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl leading-relaxed">
              Connect with our industrial safety engineers for pilot trials, integrations, and deployment support.
            </p>
          </div>

          {/* 3 Channels (Balanced Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">HSE Operations</span>
              <p className="text-sm font-bold text-slate-900 font-mono">hse@suraksha.ai</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Security Officer</span>
              <p className="text-sm font-bold text-slate-900 font-mono">security@suraksha.ai</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Engineering</span>
              <p className="text-sm font-bold text-slate-900 font-mono">core@suraksha.ai</p>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Send an Inquiry</h2>
            {sent ? (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-bold text-emerald-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Message received. Our engineering team will respond within 24 hours.</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Name &amp; Role
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra (Lead Safety Engineer)"
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@organization.com"
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Inquiry Details
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your plant setup, operating units, or questions on the reasoning engine..."
                    className="w-full rounded-xl border border-slate-300 p-3.5 text-sm font-normal leading-relaxed text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900 transition"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 shadow-sm cursor-pointer active:scale-[0.99]"
                >
                  <span>Submit Inquiry</span>
                  <ArrowRight className="h-4 w-4" />
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
