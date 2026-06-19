"use client";

import Link from "next/link";
import { WifiOff, Zap, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-indigo-900 flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-3xl bg-indigo-800/60 border border-indigo-700 flex items-center justify-center">
            <WifiOff className="h-10 w-10 text-indigo-400" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-white mb-2">You&apos;re Offline</h1>
        <p className="text-indigo-300 text-sm leading-relaxed mb-8">
          No internet connection detected. Your saved lesson plans and IPDP
          responses are still available locally — connect to the internet to
          use AI suggestions and sync your work.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm py-3 px-4 rounded-xl transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/saved"
            className="w-full flex items-center justify-center gap-2 bg-indigo-800/60 hover:bg-indigo-700/60 text-indigo-200 font-medium text-sm py-3 px-4 rounded-xl transition-colors border border-indigo-700"
          >
            <Zap className="h-4 w-4" />
            View Saved Plans
          </Link>
        </div>

        <p className="text-indigo-600 text-xs mt-8">
          Brought to you by <span className="text-indigo-400 font-semibold">Tamand Inc.</span>
        </p>
      </div>
    </div>
  );
}
