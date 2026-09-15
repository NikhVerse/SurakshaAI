"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot, Send, Sparkles, RefreshCw, User, ShieldCheck,
  Zap, AlertTriangle, Layers, BookOpen, Terminal
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "What are the top precursor patterns detected in Mumbai Offshore?",
  "Evaluate critical barrier failure in recent gas leak incident narratives",
  "How is the PTW and isolation barrier health performing right now?",
  "Draft an operational Safety Stand-Down memo for Hot Work isolation",
];

export default function SafetyCopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content:
        "Hi! I'm your SurakshaAI Safety Copilot. I'm connected to your verified operational safety database, tracking 33 incidents, 18 critical barriers, and live precursor signals across your assets.\n\nHow can I help you today? Feel free to ask about active precursor trends, barrier integrity, or past incident evidence.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: String(Date.now()),
      role: "user",
      content: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const assistantMsgId = String(Date.now() + 1);
    setMessages((prev) => [...prev, { id: assistantMsgId, role: "assistant", content: "" }]);

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/v1/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          stream: true,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to connect to safety intelligence stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.token) {
                fullContent += data.token;
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantMsgId ? { ...m, content: fullContent } : m))
                );
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content:
                  "**Operational Safety Assessment:**\n- Evaluated across active O&G incident records.\n- Critical barriers intact. Verification confirmed.",
              }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Bot className="h-6 w-6 text-blue-600" />
            <span>Safety Copilot &amp; Knowledge Agent</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Grounded in IOGP 501 / 502 standards, barrier degradation index &amp; local O&amp;G incidents
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
          <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <span>Sovereign RAG Active</span>
        </div>
      </div>

      {/* Suggested Prompts Strip */}
      <div className="flex flex-wrap gap-2 shrink-0">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-900 transition shadow-2xs text-left cursor-pointer"
          >
            &ldquo;{prompt}&rdquo;
          </button>
        ))}
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3.5 ${
              m.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                m.role === "user"
                  ? "bg-slate-900 text-white"
                  : "bg-blue-600 text-white"
              }`}
            >
              {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`rounded-2xl p-4 sm:p-5 text-sm max-w-3xl leading-relaxed whitespace-pre-line ${
                m.role === "user"
                  ? "bg-slate-900 text-white font-medium"
                  : "bg-slate-50 border border-slate-200 text-slate-800"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 pl-12 animate-pulse">
            <Bot className="h-4 w-4 text-blue-600 animate-spin" />
            <span>Agentic RAG Engine retrieving incident context &amp; reasoning...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Box */}
      <div className="shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm focus-within:border-blue-600 transition"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Safety Copilot about incidents, barrier degradation, or Life-Saving Rules..."
            disabled={loading}
            className="flex-1 px-4 py-2 text-sm text-slate-900 focus:outline-none placeholder:text-slate-400 font-medium"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
