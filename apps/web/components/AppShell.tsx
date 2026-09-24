"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  Layers,
  ShieldCheck,
  Database,
  FileCheck2,
  BookOpen,
  Settings,
  LogOut,
  Search,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Logo from "@/components/Logo";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { name: "Triage Queue", href: "/app/triage", icon: AlertTriangle },
  { name: "Incidents", href: "/app/reports", icon: FileText },
  { name: "Precursors", href: "/app/precursors", icon: Layers },
  { name: "Barrier Health", href: "/app/barriers", icon: ShieldCheck },
  { name: "Knowledge Base", href: "/app/knowledge", icon: Database },
  { name: "Audit Trail", href: "/app/audit-log", icon: FileCheck2 },
  { name: "Settings", href: "/app/settings", icon: Settings },
  { name: "Documentation", href: "/docs", icon: BookOpen },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = (user?.full_name || user?.email || "OP")
    .split(/[\s@._]+/)
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Desktop Slim Icon Rail Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden md:flex w-[72px] flex-col justify-between items-center bg-white border-r border-slate-200 py-4 shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
        {/* Top: Geometric Logo */}
        <div className="flex flex-col items-center gap-6 w-full">
          <Link
            href="/app/dashboard"
            className="p-2 rounded-xl transition hover:bg-slate-100 flex items-center justify-center"
            title="Suraksha Safety Intelligence"
          >
            <Logo size="icon" iconOnly />
          </Link>

          <div className="w-8 h-[1px] bg-slate-200" />

          {/* Navigation Icon List */}
          <nav className="flex flex-col items-center gap-2 w-full px-2">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/app/dashboard" &&
                  item.href !== "/docs" &&
                  pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <div key={item.href} className="relative group flex items-center justify-center w-full">
                  <Link
                    href={item.href}
                    className={`relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-150 cursor-pointer ${isActive
                        ? "bg-[#f0f0f4] text-slate-900 border border-slate-200/90 shadow-xs"
                        : "text-slate-500 hover:bg-slate-100/90 hover:text-slate-900"
                      }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.6} />

                    {/* Active Accent Pip */}
                    {isActive && (
                      <span className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-3 rounded-full bg-slate-900" />
                    )}
                  </Link>

                  {/* Floating Dark Pill Tooltip */}
                  <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 pointer-events-none z-50 hidden md:flex items-center px-3 py-1.5 rounded-full bg-[#18181b] text-white text-xs font-semibold shadow-2xl opacity-0 translate-x-[-6px] scale-95 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 transition-all duration-150 ease-out whitespace-nowrap">
                    <span>{item.name}</span>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Profile & Logout */}
        <div className="flex flex-col items-center gap-2.5 w-full px-2">
          <div className="w-8 h-[1px] bg-slate-200 mb-1" />

          {/* User Profile Icon */}
          <div className="relative group flex items-center justify-center w-full">
            <Link
              href="/app/settings"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-xs hover:ring-2 hover:ring-slate-300 transition shadow-xs"
            >
              {initials}
            </Link>

            {/* Profile Tooltip */}
            <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 pointer-events-none z-50 hidden md:flex flex-col px-3 py-1.5 rounded-xl bg-[#18181b] text-white text-xs shadow-2xl opacity-0 translate-x-[-6px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 whitespace-nowrap">
              <span className="font-bold text-white leading-tight">
                {user?.full_name || user?.email || "Operator"}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono capitalize">
                {user?.role ? user.role.replace(/_/g, " ").toLowerCase() : "Authorized Operator"}
              </span>
            </div>
          </div>

          {/* Sign out */}
          <div className="relative group flex items-center justify-center w-full">
            <button
              type="button"
              onClick={() => logout()}
              className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.6} />
            </button>

            {/* Sign Out Tooltip */}
            <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 pointer-events-none z-50 hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18181b] text-white text-xs font-semibold shadow-2xl opacity-0 translate-x-[-6px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 whitespace-nowrap">
              <span>Sign Out</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white p-5 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <Logo size="small" />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-6 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${isActive
                          ? "bg-slate-900 text-white"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.6} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <button
              type="button"
              onClick={() => logout()}
              className="flex items-center gap-2 p-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </aside>
        </div>
      )}

      {/* Main Canvas Area (Offset by 72px on desktop) */}
      <div className="flex flex-1 flex-col md:pl-[72px]">
        {/* Sleek Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-6 lg:px-8 bg-white/95 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Dynamic Compact Breadcrumbs */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              {(() => {
                const getBreadcrumbs = () => {
                  if (pathname.includes("/app/dashboard")) return ["Operations", "Dashboard"];
                  if (pathname.includes("/app/triage")) return ["Operations", "Triage Queue"];
                  if (pathname.includes("/app/reports")) return ["Operations", "Incidents"];
                  if (pathname.includes("/app/precursors")) return ["Operations", "Precursors"];
                  if (pathname.includes("/app/barriers")) return ["Operations", "Barrier Health"];
                  if (pathname.includes("/app/knowledge")) return ["Governance", "Knowledge Base"];
                  if (pathname.includes("/app/audit-log")) return ["Governance", "Audit Trail"];
                  if (pathname.includes("/app/settings")) return ["System", "Settings"];
                  if (pathname.includes("/docs")) return ["System", "Documentation"];
                  return ["Suraksha", "Console"];
                };
                const [section, page] = getBreadcrumbs();
                return (
                  <>
                    <span className="text-slate-400">{section}</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 font-bold">{page}</span>
                  </>
                );
              })()}
            </div>

            <div className="hidden lg:block w-[1px] h-4 bg-slate-200" />

            {/* Quick Search */}
            <div className="hidden sm:flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-1.5 text-sm text-slate-600 w-72 focus-within:border-slate-400 focus-within:bg-white transition shadow-2xs">
              <Search className="h-4 w-4 text-slate-400 shrink-0" strokeWidth={1.6} />
              <input
                type="text"
                placeholder="Search incidents, barriers, precursors..."
                className="w-full bg-transparent focus:outline-none text-slate-900 text-xs font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Clean Genuine Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Telemetry Active</span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/70 px-1 rounded">5 Sites</span>
            </div>

            <Link
              href="/docs"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
            >
              <span>Docs</span>
              <ExternalLink className="h-3 w-3" strokeWidth={1.6} />
            </Link>
          </div>
        </header>

        {/* Spacious Main Page Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
