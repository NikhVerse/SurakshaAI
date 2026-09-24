"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  X,
  ChevronDown,
  Send,
  RotateCcw,
  Check,
  ArrowRight,
  Cpu,
} from "lucide-react";
import { helpdeskApi, HelpDeskModel, HelpDeskMessage } from "@/lib/api";

const DEFAULT_MODELS: HelpDeskModel[] = [
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    description: "Fast & direct answers",
    badge: "Fast",
    is_active: true,
    context_window: "1M",
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    description: "Deep hazard reasoning",
    badge: "Deep",
    is_active: true,
    context_window: "2M",
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    description: "Safety compliance & standards",
    badge: "Safety",
    is_active: true,
    context_window: "200k",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description: "Multimodal procedures",
    badge: "Multimodal",
    is_active: true,
    context_window: "128k",
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek-R1",
    provider: "DeepSeek",
    description: "Logic & calculations",
    badge: "Logic",
    is_active: true,
    context_window: "64k",
  },
  {
    id: "suraksha-local-v1",
    name: "Suraksha Local",
    provider: "SurakshaAI",
    description: "Private on-prem engine",
    badge: "Private",
    is_active: true,
    context_window: "32k",
  },
];

interface ChatItem extends HelpDeskMessage {
  id: string;
  timestamp: string;
  modelUsed?: string;
  suggestedActions?: string[];
  navigationLinks?: Array<{ title: string; href: string }>;
}

const INITIAL_SUGGESTIONS = [
  "Report incident",
  "What is pSIF?",
  "Barrier health",
  "Triage queue",
  "Search manuals",
];

export default function HelpDesk() {
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState<HelpDeskModel[]>(DEFAULT_MODELS);
  const [selectedModel, setSelectedModel] = useState<string>("gemini-2.5-flash");
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [messages, setMessages] = useState<ChatItem[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: "Hi! How can I help you today? Ask a question or choose a shortcut below.",
      timestamp: "Just now",
      modelUsed: "Gemini 2.5 Flash",
      suggestedActions: [
        "Report incident",
        "What is pSIF?",
        "Barrier health",
      ],
      navigationLinks: [
        { title: "New Report", href: "/app/reports/new" },
        { title: "Triage", href: "/app/triage" },
        { title: "Barriers", href: "/app/barriers" },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch available models on mount
  useEffect(() => {
    helpdeskApi
      .getModels()
      .then((data) => {
        if (data && data.length > 0) setModels(data);
      })
      .catch(() => {
        setModels(DEFAULT_MODELS);
      });
  }, []);

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

  const activeModelObj =
    models.find((m) => m.id === selectedModel) || models[0] || DEFAULT_MODELS[0];

  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
    setShowModelPicker(false);
    const chosen = models.find((m) => m.id === modelId);

    const systemMsg: ChatItem = {
      id: `sys-${Date.now()}`,
      role: "assistant",
      content: `Switched to **${chosen?.name || modelId}**.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      modelUsed: chosen?.name,
    };
    setMessages((prev) => [...prev, systemMsg]);
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

      const res = await helpdeskApi.sendMessage(query, selectedModel, historyPayload);

      const assistantMsg: ChatItem = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed: res.model_used,
        suggestedActions: res.suggested_actions,
        navigationLinks: res.navigation_links,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (!isOpen) {
        setUnreadCount((c) => c + 1);
      }
    } catch {
      // Graceful local fallback
      const fallbackMsg: ChatItem = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content:
          "Here are quick shortcuts:\n\n" +
          "• **[New Report](/app/reports/new)** — File an incident\n" +
          "• **[Triage Queue](/app/triage)** — Review pending cases\n" +
          "• **[Barrier Health](/app/barriers)** — Inspect safety barriers\n" +
          "• **[Knowledge Base](/app/knowledge)** — Safety manuals",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed: activeModelObj.name,
        navigationLinks: [
          { title: "New Report", href: "/app/reports/new" },
          { title: "Barriers", href: "/app/barriers" },
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: "Chat cleared. What can I help you with?",
        timestamp: "Just now",
        modelUsed: activeModelObj.name,
        suggestedActions: ["Report incident", "What is pSIF?", "Barrier health"],
      },
    ]);
  };

  // Helper to format simple markdown (bold, lists, links)
  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    return (
      <div className="space-y-1.5 text-xs text-slate-800 leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-0.5" />;

          // Headings
          if (line.startsWith("### ")) {
            return (
              <h4 key={idx} className="text-xs font-bold text-slate-900 mt-1.5 mb-0.5">
                {line.replace("### ", "")}
              </h4>
            );
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
                <span className="font-semibold text-slate-500 font-mono text-[11px]">
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
      .replace(/`([^`]+)`/g, '<code class="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px] text-slate-800">$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 font-medium hover:underline">$1</a>');
  };

  return (
    <>
      {/* Floating Trigger Bubble Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2.5 shadow-lg hover:shadow-xl border border-slate-700/80 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer text-xs font-semibold"
            aria-label="Open Help Desk"
          >
            <div className="relative flex items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <Bot className="h-4 w-4 text-emerald-400" />
            <span>Help</span>

            {unreadCount > 0 && (
              <span className="h-4 min-w-4 px-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        )}

        {/* Floating Chat Modal Window */}
        {isOpen && (
          <div className="w-[370px] sm:w-[385px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100vh-5rem)] bg-white border border-slate-200/90 shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-bottom-3">
            {/* Window Header */}
            <div className="px-3.5 py-2.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 select-none">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-white">Help Desk</h3>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-[10px] text-slate-400">Quick answers &amp; navigation</p>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Clear conversation"
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close Help Desk"
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Model Selector Pill Bar */}
            <div className="relative px-3 py-1.5 bg-slate-50 border-b border-slate-200/70 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Cpu className="h-3 w-3 text-slate-400" />
                <span className="text-[10px] text-slate-500 font-medium">Model:</span>
                <button
                  type="button"
                  onClick={() => setShowModelPicker(!showModelPicker)}
                  className="flex items-center gap-1 font-semibold text-slate-800 bg-white hover:bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px] shadow-2xs transition cursor-pointer"
                >
                  <span className="truncate max-w-[130px]">{activeModelObj.name}</span>
                  <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
                </button>
              </div>

              <span className="text-[9px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                {activeModelObj.badge}
              </span>

              {/* Compact Model Picker Dropdown */}
              {showModelPicker && (
                <div className="absolute top-full left-2 right-2 mt-1 z-30 bg-white rounded-xl border border-slate-200 shadow-xl p-1.5 space-y-1 animate-in fade-in">
                  <div className="px-2 py-1 text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Model
                  </div>
                  {models.map((m) => {
                    const isCurrent = m.id === selectedModel;
                    return (
                      <div
                        key={m.id}
                        onClick={() => handleSelectModel(m.id)}
                        className={`px-2.5 py-1.5 rounded-lg cursor-pointer transition flex items-center justify-between gap-2 text-left ${
                          isCurrent
                            ? "bg-slate-900 text-white"
                            : "hover:bg-slate-50 text-slate-800"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold">{m.name}</span>
                            <span
                              className={`text-[9px] px-1 rounded ${
                                isCurrent
                                  ? "bg-emerald-400 text-slate-950 font-bold"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {m.badge}
                            </span>
                          </div>
                          <p
                            className={`text-[10px] truncate ${
                              isCurrent ? "text-slate-300" : "text-slate-500"
                            }`}
                          >
                            {m.description}
                          </p>
                        </div>
                        {isCurrent && <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Chat Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs bg-slate-50/50">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs shadow-2xs space-y-1.5 ${
                        isUser
                          ? "bg-slate-900 text-white rounded-br-xs font-normal"
                          : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs"
                      }`}
                    >
                      {/* Message Content */}
                      {isUser ? (
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      ) : (
                        renderFormattedContent(msg.content)
                      )}

                      {/* Navigation Link Chips (if provided) */}
                      {msg.navigationLinks && msg.navigationLinks.length > 0 && (
                        <div className="pt-1 flex flex-wrap gap-1">
                          {msg.navigationLinks.map((link, lidx) => (
                            <Link
                              key={lidx}
                              href={link.href}
                              onClick={() => {
                                if (window.innerWidth < 768) setIsOpen(false);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/70 text-[10px] font-semibold transition"
                            >
                              <span>{link.title}</span>
                              <ArrowRight className="h-2.5 w-2.5" />
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Subtle Footer */}
                      <div
                        className={`flex items-center justify-between text-[9px] pt-0.5 ${
                          isUser ? "text-slate-400" : "text-slate-400"
                        }`}
                      >
                        {!isUser && msg.modelUsed && (
                          <span className="truncate max-w-[120px] text-slate-400">
                            {msg.modelUsed}
                          </span>
                        )}
                        <span className="ml-auto">{msg.timestamp}</span>
                      </div>
                    </div>

                    {/* Suggested Follow-up Actions (Only if present) */}
                    {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1 max-w-[85%]">
                        {msg.suggestedActions.map((action, aidx) => (
                          <button
                            key={aidx}
                            type="button"
                            onClick={() => handleSend(action)}
                            className="px-2 py-0.5 rounded-full bg-white hover:bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200 shadow-2xs transition cursor-pointer"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-start">
                  <div className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[10px] text-slate-400 ml-1">Thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips (Shown cleanly above input) */}
            {messages.length <= 3 && (
              <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1 overflow-x-auto no-scrollbar">
                {INITIAL_SUGGESTIONS.map((sugg, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(sugg)}
                    className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-medium whitespace-nowrap transition cursor-pointer shrink-0"
                  >
                    {sugg}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-2 bg-white border-t border-slate-200 flex items-center gap-1.5"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={loading}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="h-7 w-7 flex items-center justify-center rounded-full bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white transition cursor-pointer shrink-0"
                aria-label="Send message"
              >
                <Send className="h-3 w-3" />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
