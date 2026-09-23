import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-10">
          <Link href="/" className="transition hover:opacity-90">
            <Logo size="default" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <Link href="/about" className="hover:text-slate-900 transition">About</Link>
            <Link href="/how-it-works" className="hover:text-slate-900 transition">How It Works</Link>
            <Link href="/security" className="hover:text-slate-900 transition">Security &amp; Governance</Link>
            <Link href="/docs" className="hover:text-slate-900 transition">Documentation</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-bold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-xl hover:bg-slate-100 transition"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="text-sm font-bold text-blue-700 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition"
          >
            Sign Up
          </Link>
          <Link
            href="/app/dashboard"
            className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-sm font-bold text-white hover:bg-slate-800 transition shadow-xs"
          >
            <span>Console</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
