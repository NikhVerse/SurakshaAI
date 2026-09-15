"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-50/70 py-16 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-block transition hover:opacity-90">
          <Logo size="default" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 pt-1">
          Verify Email Address
        </h1>
        <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
          Operational account security requires verified enterprise email credentials
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6 text-center">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">Verification Link Dispatched</h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              We have sent a secure confirmation link to your registered organizational email. Please click the link to activate your operational analyst access.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 transition shadow-sm w-full"
            >
              <span>Continue to Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
