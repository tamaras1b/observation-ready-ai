"use client";

import Link from "next/link";
import { Zap, Home, FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-indigo-900 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-2xl">
            <Zap className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-8xl font-black text-indigo-500 mb-2 leading-none">404</h1>
        <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-indigo-300 text-sm mb-8 leading-relaxed">
          Looks like this page went on a field trip without telling anyone.
          Let&apos;s get you back to planning!
        </p>

        {/* Quick links */}
        <div className="space-y-3 mb-8">
          <Link href="/" className="flex items-center gap-3 bg-indigo-800/60 hover:bg-indigo-700/60 rounded-xl px-4 py-3 text-left transition-colors">
            <Home className="h-4 w-4 text-indigo-300 flex-shrink-0" />
            <span className="text-white text-sm font-medium">Go to Dashboard</span>
          </Link>
          <Link href="/lesson-plan" className="flex items-center gap-3 bg-indigo-800/60 hover:bg-indigo-700/60 rounded-xl px-4 py-3 text-left transition-colors">
            <FileText className="h-4 w-4 text-indigo-300 flex-shrink-0" />
            <span className="text-white text-sm font-medium">Build a Lesson Plan</span>
          </Link>
          <Link href="/ipdp" className="flex items-center gap-3 bg-indigo-800/60 hover:bg-indigo-700/60 rounded-xl px-4 py-3 text-left transition-colors">
            <BookOpen className="h-4 w-4 text-indigo-300 flex-shrink-0" />
            <span className="text-white text-sm font-medium">IPDP Assistant</span>
          </Link>
        </div>

        <p className="text-indigo-600 text-xs">
          Brought to you by <span className="text-indigo-400 font-semibold">Tamand Inc.</span>
        </p>
      </div>
    </div>
  );
}
