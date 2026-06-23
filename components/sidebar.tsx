"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home, FileText, BookOpen, Star, Zap, Upload,
  Shield, ScrollText, Mail, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isPro } from "@/lib/pro-status";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/lesson-plan", label: "Lesson Plan Builder", icon: FileText },
  { href: "/ipdp", label: "IPDP Assistant", icon: BookOpen },
  { href: "/standards", label: "My Standards & Questions", icon: Upload },
  { href: "/saved", label: "Saved Plans", icon: Star },
  { href: "/contact", label: "Contact", icon: Mail },
];

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-indigo-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-tight">Observation Ready AI</h1>
            <p className="text-indigo-400 text-xs">Educator Tools</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
              pathname === item.href
                ? "bg-indigo-600 text-white shadow-md"
                : "text-indigo-300 hover:bg-indigo-800 hover:text-white"
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-indigo-800 space-y-3">
        {/* School year badge */}
        <div className="rounded-lg bg-indigo-800/50 p-3">
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-indigo-400" />
            <p className="text-indigo-300 text-xs font-medium">AI-Powered Planning</p>
          </div>
          <p className="text-indigo-400 text-xs mt-0.5">School Year 2026–2027</p>
        </div>

        {/* Tamand Inc branding */}
        <div className="text-center">
          <p className="text-indigo-500 text-xs">Brought to you by</p>
          <p className="text-indigo-400 text-xs font-semibold tracking-wide">Tamand Inc.</p>
        </div>

        {/* Legal links */}
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/terms"
            onClick={onNavClick}
            className={cn(
              "flex items-center gap-1 text-xs transition-colors",
              pathname === "/terms" ? "text-indigo-300 font-medium" : "text-indigo-500 hover:text-indigo-300"
            )}
          >
            <ScrollText className="h-3 w-3" />
            Terms
          </Link>
          <span className="text-indigo-700 text-xs">•</span>
          <Link
            href="/privacy"
            onClick={onNavClick}
            className={cn(
              "flex items-center gap-1 text-xs transition-colors",
              pathname === "/privacy" ? "text-indigo-300 font-medium" : "text-indigo-500 hover:text-indigo-300"
            )}
          >
            <Shield className="h-3 w-3" />
            Privacy
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar on route change
  const pathname = usePathname();
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-64 min-h-screen border-r bg-gradient-to-b from-indigo-950 to-indigo-900 flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile: top bar with hamburger ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-indigo-950 border-b border-indigo-800 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-white p-1.5 rounded-lg hover:bg-indigo-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-white font-bold text-sm">Observation Ready AI</span>
        </div>
      </div>

      {/* ── Mobile: overlay backdrop ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile: slide-in drawer ── */}
      <aside
        className={cn(
          "md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-indigo-950 to-indigo-900 border-r border-indigo-800 transform transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button */}
        <div className="flex justify-end p-3 border-b border-indigo-800">
          <button
            onClick={() => setMobileOpen(false)}
            className="text-indigo-300 hover:text-white p-1.5 rounded-lg hover:bg-indigo-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="h-[calc(100%-52px)] overflow-y-auto">
          <SidebarContent onNavClick={() => setMobileOpen(false)} />
        </div>
      </aside>
    </>
  );
}
