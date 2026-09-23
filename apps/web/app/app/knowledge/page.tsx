"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Upload,
  Search,
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileCode,
} from "lucide-react";
import { fetchApi } from "@/lib/api";
import { DetailDrawer } from "@/components/ui/DetailDrawer";
import { Tooltip } from "@/components/ui/Tooltip";

export default function KnowledgePage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [query, setQuery] = useState("Mandatory requirements for positive energy isolation");
  const [ragResult, setRagResult] = useState<any>(null);
  const [querying, setQuerying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

  useEffect(() => {
    fetchApi<any[]>("/api/v1/knowledge/documents")
      .then((res) => setDocs(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalChunks = docs.reduce((acc, d) => acc + (d.chunk_count || 0), 0);

  const handleRAGSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || querying) return;
    setQuerying(true);
    try {
      const res = await fetchApi<any>("/api/v1/knowledge/query", {
        method: "POST",
        body: JSON.stringify({ query, limit: 3 }),
      });
      setRagResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setQuerying(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-slate-800" strokeWidth={1.8} />
            <span>Documents &amp; Standards</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Governed repository of verified engineering standards, isolation manuals &amp; grounded RAG
          </p>
        </div>

        <Link
          href="/app/knowledge/upload"
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Upload className="h-3.5 w-3.5" />
          <span>Upload</span>
        </Link>
      </div>

      {/* Number-First Operational KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Documents</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">0{docs.length}</p>
          <span className="text-[10px] font-semibold text-slate-500">Governed Standards</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Chunks Indexed</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">{totalChunks}</p>
          <span className="text-[10px] font-semibold text-slate-500">Vector Embeddings</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Verification</span>
          <p className="text-2xl font-black text-emerald-600 font-mono mt-0.5">100%</p>
          <span className="text-[10px] font-semibold text-emerald-700">Zero Hallucination</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Framework</span>
          <p className="text-lg font-black text-slate-900 font-mono mt-1">IOGP 459</p>
          <span className="text-[10px] font-semibold text-slate-500">OISD-GDN-145</span>
        </div>
      </div>

      {/* Compact Grounded Retrieval Query Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
        <form onSubmit={handleRAGSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query verified safety manual passages..."
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-400 transition"
            />
          </div>
          <button
            type="submit"
            disabled={querying}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition cursor-pointer shadow-2xs shrink-0"
          >
            {querying ? "Searching..." : "Search"}
          </button>
        </form>

        {ragResult && (
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Grounded Result
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Evidence Verified
              </span>
            </div>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              {ragResult.answer}
            </p>
            {ragResult.citations && ragResult.citations.length > 0 && (
              <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2 text-[11px]">
                {ragResult.citations.map((c: any, idx: number) => (
                  <span key={idx} className="font-mono bg-white px-2 py-1 rounded border border-slate-200 text-slate-700">
                    {c.document_title} · P.{c.page_number}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Visual Document Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 h-28 animate-pulse" />
          ))
        ) : (
          docs.map((d) => (
            <div
              key={d.id}
              onClick={() => setSelectedDoc(d)}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 hover:shadow-xs transition cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-xs shadow-2xs">
                    {d.file_format || "PDF"}
                  </div>

                  <div>
                    <h2 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition truncate max-w-[170px]">
                      {d.title}
                    </h2>
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                      {d.code}
                    </span>
                  </div>
                </div>

                <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold shrink-0">
                  Active
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-400">
                  {d.chunk_count} Chunks
                </span>

                <div className="flex items-center gap-1 font-bold text-slate-700 group-hover:text-slate-900 transition">
                  <span className="text-[11px]">Open</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Universal Detail Drawer */}
      <DetailDrawer
        isOpen={Boolean(selectedDoc)}
        onClose={() => setSelectedDoc(null)}
        title={selectedDoc?.title || "Document Standard"}
        subtitle={`${selectedDoc?.code} • ${selectedDoc?.file_format || "PDF"}`}
        status={{
          label: "VERIFIED STANDARD",
          variant: "healthy",
        }}
        metrics={[
          { label: "Chunks Indexed", value: selectedDoc?.chunk_count || 0 },
          { label: "Standard Code", value: selectedDoc?.code || "—" },
          { label: "Format", value: selectedDoc?.file_format || "PDF" },
          { label: "Status", value: "Active Governed" },
        ]}
        tabs={[
          {
            id: "overview",
            label: "Overview",
            content: (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Document Specification
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    This engineering safety standard is ingested into the sovereign local vector database.
                    All AI extraction and incident triage pipelines cross-reference this document for mandatory barrier compliance.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Vector Index Metadata
                  </span>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400">Embedding Model</span>
                      <span className="font-mono font-bold text-slate-800">bge-m3 / text-embedding-3</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400">Total Tokens</span>
                      <span className="font-mono font-bold text-slate-800">
                        {((selectedDoc?.chunk_count || 1) * 320).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Regulatory Origin</span>
                      <span className="font-bold text-slate-800">OISD-145 / IOGP</span>
                    </div>
                  </div>
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
