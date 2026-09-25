"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Headset,
  X,
  Send,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { helpdeskApi, HelpDeskMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface ChatItem extends HelpDeskMessage {
  id: string;
  timestamp: string;
  suggestedActions?: string[];
  navigationLinks?: Array<{ title: string; href: string }>;
}

const INITIAL_SUGGESTIONS = [
  "What is pSIF?",
  "How to report an incident?",
  "Inspect critical barriers",
  "Triage workflow",
];

export default function HelpDesk() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [messages, setMessages] = useState<ChatItem[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Hello! I am your AI assistant, powered by **OpenAI**.\n\n" +
        "You can converse with me naturally about anything: incident investigation, " +
        "evaluating pSIF risks, monitoring IOGP critical barriers, or navigating this console. How can I help you today?",
      timestamp: "Just now",
      suggestedActions: [
        "What is pSIF?",
        "Report an incident",
        "Inspect critical barriers",
      ],
      navigationLinks: [
        { title: "New Report", href: "/app/reports/new" },
        { title: "Barrier Health", href: "/app/barriers" },
        { title: "Triage", href: "/app/triage" },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Help Desk is available AFTER LOGIN ONLY
  if (!user) {
    return null;
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content:
          "Conversation cleared. I am ready for your questions—feel free to ask anything about safety procedures or platform navigation.",
        timestamp: "Just now",
        suggestedActions: ["Report incident", "What is pSIF?", "Barrier health"],
      },
    ]);
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatItem = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await helpdeskApi.sendMessage(query, "gpt-4o", historyPayload);

      const assistantMsg: ChatItem = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: res.suggested_actions,
        navigationLinks: res.navigation_links,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (!isOpen) {
        setUnreadCount((c) => c + 1);
      }
    } catch {
      // Natural fallback
      const fallbackMsg: ChatItem = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content:
          "I'm here to help. You can navigate the platform using these key sections:\n\n" +
          "• **[New Report](/app/reports/new)** — File a safety observation or incident\n" +
          "• **[Barrier Health](/app/barriers)** — Inspect defensive safety barriers\n" +
          "• **[Triage Queue](/app/triage)** — Review pending high-risk cases\n" +
          "• **[Account Settings](/app/settings)** — Update your operator profile\n\n" +
          "Feel free to ask another question anytime.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        navigationLinks: [
          { title: "New Report", href: "/app/reports/new" },
          { title: "Barrier Health", href: "/app/barriers" },
          { title: "Triage", href: "/app/triage" },
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    return (
      <div className="space-y-1.5 leading-relaxed text-xs">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }

          // Bullet points
          if (line.startsWith("* ") || line.startsWith("- ") || line.startsWith("• ")) {
            const rawText = line.replace(/^[\*\-•]\s+/, "");
            return (
              <div key={idx} className="flex items-start gap-1.5 ml-0.5">
                <span className="text-slate-400 font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(rawText) }} />
              </div>
            );
          }

          // Numbered lists
          const numMatch = line.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-1.5 ml-0.5">
                <span className="font-semibold text-slate-500 font-mono text-[12px]">
                  {numMatch[1]}.
                </span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: formatInlineMarkdown(numMatch[2]),
                  }}
                />
              </div>
            );
          }

          return (
            <p
              key={idx}
              dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }}
            />
          );
        })}
      </div>
    );
  };

  const formatInlineMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="font-mono bg-slate-100 px-1 py-0.5 rounded text-[12px] text-slate-800">$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 font-medium hover:underline">$1</a>');
  };

  return (
    <>
      {/* Floating Trigger Bubble Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center h-12 w-12 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl border border-slate-700/80 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            aria-label="Help Desk"
            title="Help Desk (Powered by OpenAI)"
          >
            <Headset className="h-5 w-5 text-emerald-400 group-hover:rotate-12 transition-transform duration-200" />

            {/* Live Indicator Pulse Dot */}
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900" />
            </span>

            {unreadCount > 0 && (
              <span className="absolute -bottom-1 -right-1 h-4.5 min-w-4.5 px-1 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-bold flex items-center justify-center border-2 border-slate-900 shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>
        )}

        {/* Floating Chat Modal Window */}
        {isOpen && (
          <div className="w-[370px] sm:w-[395px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100vh-5rem)] bg-white border border-slate-200/90 shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-bottom-3 font-sans">
            {/* Window Header */}
            <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 select-none">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Headset className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-white">Help Desk</h3>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-1.5 py-0.2 rounded-md flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      OpenAI
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Natural ChatGPT-style assistant</p>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Clear conversation"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close Help Desk"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs bg-slate-50/50">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-2xs space-y-1.5 ${
                        isUser
                          ? "bg-slate-900 text-white rounded-br-xs font-normal"
                          : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs"
                      }`}
                    >
                      {/* Content */}
                      <div>{renderFormattedContent(msg.content)}</div>

                      {/* Navigation Link Buttons (if any) */}
                      {msg.navigationLinks && msg.navigationLinks.length > 0 && (
                        <div className="pt-1.5 flex flex-wrap gap-1.5 border-t border-slate-100">
                          {msg.navigationLinks.map((link, idx) => (
                            <Link
                              key={idx}
                              href={link.href}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[12px] border border-blue-200/70 transition"
                            >
                              <span>{link.title}</span>
                              <span>&rarr;</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <span className="text-[10px] text-slate-400 px-1 mt-0.5 font-medium">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {/* Typing / Loading Indicator */}
              {loading && (
                <div className="flex items-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-3.5 py-2.5 shadow-2xs flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Starters */}
            {messages.length <= 2 && (
              <div className="px-3.5 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[12px]">
                {INITIAL_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(sug)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer shrink-0"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}

            {/* Input Footer Bar */}
            <div className="p-3 bg-white border-t border-slate-200/80">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything naturally..."
                  disabled={loading}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer shrink-0 shadow-2xs"
                  aria-label="Send message"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
              <p className="text-[10px] text-slate-400 text-center pt-1.5">
                OpenAI &bull; Natural conversational safety intelligence
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
