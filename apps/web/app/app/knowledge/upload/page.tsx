"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function KnowledgeUploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState("PROCEDURE");
  const [sourceAuthority, setSourceAuthority] = useState("Corporate HSE Governance");
  const [version, setVersion] = useState("1.0");
  const [fileContent, setFileContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("document_type", documentType);
      formData.append("source_org", "OIL");
      formData.append("source_authority", sourceAuthority);
      formData.append("version", version);

      const blob = new Blob([fileContent], { type: "text/plain" });
      formData.append("file", blob, `${title.replace(/\s+/g, "_")}.txt`);

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        (typeof window !== "undefined" ? "" : "http://localhost:8000");
      const token = typeof window !== "undefined" ? localStorage.getItem("suraksha_token") : null;
      const res = await fetch(`${apiUrl}/api/v1/knowledge/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/app/knowledge"), 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-500 border-b border-slate-200 pb-4">
        <Link href="/app/knowledge" className="hover:text-slate-900 transition flex items-center gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Knowledge Center</span>
        </Link>
      </div>

      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Upload Governed Safety Document
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Ingest official safety procedures, energy isolation manuals, and barrier standards into the grounded RAG index
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        {success && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <span>Document successfully indexed into semantic vector database. Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Document Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Standard Operating Procedure for Hazardous Energy Isolation"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-900 cursor-pointer bg-white"
              >
                <option value="MANDATORY_STANDARD">Mandatory Standard</option>
                <option value="PROCEDURE">Operating Procedure</option>
                <option value="GUIDELINE">Safety Guideline</option>
                <option value="LESSONS_LEARNED">Lessons Learned</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Issuing Authority
              </label>
              <input
                type="text"
                value={sourceAuthority}
                onChange={(e) => setSourceAuthority(e.target.value)}
                placeholder="e.g. Corporate HSE Directorate"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Version Tag
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g. 2026.1"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Governed Document Text Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={8}
              required
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              placeholder="Paste full text content of safety procedure, isolation checklists, and barrier requirements..."
              className="w-full rounded-xl border border-slate-200 p-3.5 text-sm font-normal leading-relaxed text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900 transition font-mono"
            ></textarea>
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-slate-100">
            <span className="text-xs text-slate-400 font-medium">
              Zero Hallucination Grounding Index
            </span>
            <button
              type="submit"
              disabled={loading || success}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50 shadow-xs cursor-pointer active:scale-[0.99]"
            >
              <span>{loading ? "Indexing Chunks..." : "Upload & Index Document"}</span>
              <Upload className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
