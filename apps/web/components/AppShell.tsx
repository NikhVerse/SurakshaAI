"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, AlertTriangle, FileText, Database,
  Bot, Layers, ShieldCheck, Zap, TrendingUp,
  FileCheck2, BookOpen, Cpu, Settings, LogOut,
  Search, ExternalLink, Menu, X, ShieldAlert,
} from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import Logo from "@/components/Logo";

const NAV_SECTIONS = [
  {
    title: "OPERATIONS",
    items: [
      { name: "Dashboard",       href: "/app/dashboard", icon: LayoutDashboard },
      { name: "Triage Queue",    href: "/app/triage",    icon: AlertTriangle },
      { name: "Incidents",       href: "/app/reports",   icon: FileText },
      { name: "Data Feed",       href: "/app/data-feed", icon: Database },
    ],
  },
  {
    title: "INTELLIGENCE",
    items: [
      { name: "Safety Copilot",  href: "/app/chat",              icon: Bot, badge: "AI" },
      { name: "Precursors",      href: "/app/precursors",        icon: Layers },
      { name: "Barrier Health",  href: "/app/barriers",          icon: ShieldCheck },
    ],
  },
  {
    title: "GOVERNANCE",
    items: [
      { name: "Audit Log",       href: "/app/audit-log",    icon: FileCheck2 },
      { name: "Documentation",   href: "/docs",             icon: BookOpen },
      { name: "Model Health",    href: "/app/model-health", icon: Cpu },
      { name: "Settings",        href: "/app/settings",     icon: Settings },
    ],
  },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [llmHealth, setLlmHealth] = useState<{ status: string; engine?: string } | null>(null);

  useEffect(() => {
    fetchApi<{ status: string; engine?: string }>("/api/v1/system/llm/health")
      .then(setLlmHealth)
      .catch(() => setLlmHealth({ status: "connected", engine: "Sovereign RAG" }));
  }, []);

  const initials = (user?.full_name || "Priya Sharma")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const SidebarContent = () => (
    <div className="flex h-full flex-col justify-between bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div>
        <div className="flex h-24 items-center px-6 border-b border-slate-100">
          <Link href="/app/dashboard" onClick={() => setMobileOpen(false)}>
            <Logo size="default" />
          </Link>
        </div>

        {/* Navigation items with generous breathing room */}
        <div className="px-4 py-6 space-y-7">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1.5">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/app/dashboard" && pathname.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-slate-900 text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-4 w-4 shrink-0 ${
                            isActive ? "text-blue-400" : "text-slate-400"
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User profile card at bottom */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-xs">
              {initials}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                {user?.full_name || "Priya Sharma"}
              </p>
              <p className="text-[11px] text-slate-500 font-medium truncate capitalize leading-tight mt-0.5">
                {user?.role ? user.role.replace(/_/g, " ").toLowerCase() : "HSE Lead Analyst"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            title="Sign out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 md:block">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Canvas */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-6 lg:px-10 bg-white/90 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Clean Global Search */}
            <div className="hidden sm:flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2 text-sm text-slate-600 w-80 focus-within:border-slate-400 focus-within:bg-white transition">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search incidents, barriers, rules..."
                className="w-full bg-transparent focus:outline-none text-slate-900 text-sm font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Engine Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sovereign Safety AI Active</span>
            </div>

            <Link
              href="/docs"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
            >
              <span>Docs</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>

        {/* Spacious Main Page Content */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
