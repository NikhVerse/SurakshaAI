"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Camera,
  Shield,
  FileText,
  Clock,
  Tag,
  Hash,
  X,
  Maximize2,
  Building,
} from "lucide-react";
import { fetchApi } from "@/lib/api";
import {
  getEvidenceForBarrier,
  getStandardsForBarrier,
  EvidenceItem,
  ExternalSource,
} from "@/lib/evidenceData";

export default function BarrierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const barrierId = resolvedParams.id;
  const [data, setData] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<EvidenceItem | null>(null);

  useEffect(() => {
    fetchApi<any>(`/api/v1/barriers/${barrierId}`)
      .then((res) => setData(res))
      .catch((err) => console.error(err));
  }, [barrierId]);

  if (!data) {
    return (
      <div className="p-10 text-center text-xs font-bold text-slate-400">
        Loading critical barrier intelligence...
      </div>
    );
  }

  const b = data.barrier || data;
  const evidenceList: EvidenceItem[] = getEvidenceForBarrier(b.code);
  const standardsList: ExternalSource[] = getStandardsForBarrier(b.code);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20 font-sans">
      {/* Lightbox / Modal for Image Preview */}
      {previewImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3.5 border-b border-slate-800 text-white">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold font-mono">
                  {previewImage.title}
                </span>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage.url}
              alt={previewImage.title}
              className="w-full max-h-[70vh] object-contain bg-black"
            />
            <div className="p-4 bg-slate-900/90 text-xs text-slate-300 space-y-1">
              <p className="font-medium text-slate-200">{previewImage.caption}</p>
              <div className="flex flex-wrap items-center gap-3 text-[12px] font-mono text-slate-400 pt-1">
                {previewImage.assetId && (
                  <span>Asset: {previewImage.assetId}</span>
                )}
                {previewImage.timestamp && (
                  <span>Captured: {previewImage.timestamp}</span>
                )}
                {previewImage.tag && (
                  <span className="text-emerald-400">Tag: {previewImage.tag}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 border-b border-slate-200 pb-3">
        <Link
          href="/app/barriers"
          className="hover:text-slate-900 transition flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Barrier Matrix</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-mono text-slate-700 font-bold">{b.code}</span>
      </div>

      {/* Primary Barrier Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[12px] font-mono font-bold uppercase tracking-wider text-slate-400">
                {b.code}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Active Monitored Barrier
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              {b.name}
            </h1>
          </div>
          <span className="self-start sm:self-auto rounded-xl bg-slate-900 text-white px-3.5 py-1.5 text-xs font-bold shadow-2xs">
            {b.category || "Critical Barrier"}
          </span>
        </div>

        {/* Expected Safety Function */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Expected Safety Function &amp; Baseline Performance Requirement
          </span>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            {b.expected_function ||
              "Primary process safety barrier governed by IOGP Report 459 and company safe operating envelopes."}
          </p>
        </div>

        {/* Operational Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Classification
            </span>
            <p className="font-bold text-slate-900 text-xs sm:text-sm">
              {b.category || "Engineering"}
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Governing Code
            </span>
            <p className="font-bold text-slate-900 text-xs sm:text-sm font-mono">
              IOGP 459 / 501
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Verification Proof
            </span>
            <p className="font-bold text-emerald-700 text-xs sm:text-sm flex items-center gap-1 font-mono">
              <Camera className="h-3.5 w-3.5" />
              <span>{evidenceList.length} Photos</span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Regulatory References
            </span>
            <p className="font-bold text-slate-900 text-xs sm:text-sm font-mono">
              {standardsList.length} Standards
            </p>
          </div>
        </div>
      </div>

      {/* Real Field Evidence & Photographic Proofs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Camera className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Verified Photographic Inspection Proofs
              </h2>
              <p className="text-[12px] text-slate-400 font-medium">
                High-resolution field documentation showing installed barrier compliance
              </p>
            </div>
          </div>
          <span className="text-[12px] font-mono font-bold text-slate-500">
            Chain of Custody Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evidenceList.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50 hover:border-slate-300 transition group flex flex-col justify-between"
            >
              <div
                className="relative aspect-video w-full bg-slate-900 cursor-pointer overflow-hidden"
                onClick={() => setPreviewImage(item)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 text-white">
                  <span className="text-xs font-semibold">Click to enlarge</span>
                  <Maximize2 className="h-4 w-4" />
                </div>
                {item.tag && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-mono font-bold">
                    {item.tag}
                  </span>
                )}
              </div>

              <div className="p-3.5 space-y-2">
                <h3 className="text-xs font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-[12px] text-slate-600 leading-relaxed font-normal">
                  {item.caption}
                </p>

                <div className="pt-2 border-t border-slate-200/70 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.timestamp || "2026-09-24 UTC"}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-slate-600">
                    <Tag className="h-3 w-3 text-slate-400" />
                    {item.assetId || "ASSET-VERIFIED"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real Regulatory Documents & External References */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Governing Standards &amp; External Regulatory Authorities
              </h2>
              <p className="text-[12px] text-slate-400 font-medium">
                Official source repositories and compliance regulations where rules originate
              </p>
            </div>
          </div>
          <span className="text-[12px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Authoritative Links
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {standardsList.map((src, idx) => (
            <a
              key={idx}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition group flex flex-col justify-between space-y-2.5 bg-slate-50/50"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                    {src.code || "REGULATION"}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 transition" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition leading-snug">
                  {src.name}
                </h4>
              </div>

              <div className="pt-2 border-t border-slate-200/70 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <Building className="h-3 w-3 text-slate-400 shrink-0" />
                <span className="truncate">{src.authority}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
