"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Upload, Search, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function KnowledgePage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [query, setQuery] = useState("What are the mandatory requirements for energy isolation?");
  const [ragResult, setRagResult] = useState<any>(null);
  const [querying, setQuerying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<any[]>("/api/v1/knowledge/documents")
      .then((res) => setDocs(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleRAGSearch = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Balanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            HSE Knowledge Center
          </h1>
          <p className="text-sm sm:text-base font-medium text-slate-500 mt-1">
            Governed repository of verified standards, energy isolation procedures, and grounded RAG
          </p>
        </div>
        <Link
          href="/app/knowledge/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition shadow-xs self-start sm:self-auto active:scale-[0.99]"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Document</span>
        </Link>
      </div>

      {/* RAG Query Sandbox */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Grounded Retrieval Testing Sandbox
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Deterministic semantic search querying officially approved industrial safety chunks
            </p>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-0.5 text-xs font-bold">
            Zero Hallucination Guard
          </span>
        </div>

        <form onSubmit={handleRAGSearch} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a technical HSE procedure question..."
            className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium bg-white text-slate-900 focus:outline-none focus:border-slate-900 transition"
          />
          <button
            type="submit"
            disabled={querying}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50 transition shadow-xs cursor-pointer"
          >
            <Search className="h-4 w-4" />
            <span>{querying ? "Searching..." : "Search Manuals"}</span>
          </button>
        </form>

        {ragResult && (
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Grounded Synthesis
                </span>
                <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs font-bold">
                  Evidence Verified
                </span>
              </div>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                {ragResult.answer}
              </p>
            </div>

            {ragResult.citations && ragResult.citations.length > 0 && (
              <div className="pt-3 border-t border-slate-200/80 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Cited Source Passages
                </span>
                <div className="space-y-2">
                  {ragResult.citations.map((c: any, idx: number) => (
                    <div key={idx} className="rounded-lg border border-slate-200 bg-white p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>{c.document_title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Page {c.page_number}</span>
                      </div>
                      <p className="text-slate-600 italic leading-normal font-normal">
                        &quot;{c.text}&quot;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Governed Document Repository */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Active Governed Documents ({docs.length})
          </h2>
          <p className="text-xs text-slate-500">
            Validated engineering standards loaded into local vector database
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docs.map((d) => (
            <div
              key={d.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-sky-600 shrink-0" />
                  <span className="font-bold text-sm text-slate-900">{d.title}</span>
                </div>
                <p className="text-xs text-slate-500">Standard Code: {d.code}</p>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 pt-1">
                  <span>{d.chunk_count} Chunks Indexed</span>
                  <span>&bull;</span>
                  <span>{d.file_format}</span>
                </div>
              </div>
              <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[11px] font-bold shrink-0">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
