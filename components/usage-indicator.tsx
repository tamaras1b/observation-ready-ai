"use client";

import { useEffect, useState } from "react";
import { Zap, Star } from "lucide-react";
import { isPro, FREE_DAILY_LIMIT } from "@/lib/pro-status";
import { getUsageToday } from "@/lib/usage-tracker";
import Link from "next/link";

export function UsageIndicator() {
  const [pro, setPro]         = useState(false);
  const [used, setUsed]       = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPro(isPro());
    setUsed(getUsageToday());
  }, []);

  if (!mounted) return null;

  if (pro) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
        <Star className="h-3.5 w-3.5 fill-amber-400" />
        Pro — Unlimited
      </div>
    );
  }

  const remaining = Math.max(0, FREE_DAILY_LIMIT - used);
  const pct = (used / FREE_DAILY_LIMIT) * 100;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs text-indigo-300">
        <Zap className="h-3.5 w-3.5" />
        <span>
          <span className={remaining === 0 ? "text-rose-400 font-semibold" : "text-white font-semibold"}>
            {remaining}
          </span>
          /{FREE_DAILY_LIMIT} AI left today
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1">
        {Array.from({ length: FREE_DAILY_LIMIT }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${
              i < used ? "bg-rose-400" : "bg-indigo-600"
            }`}
          />
        ))}
      </div>

      {remaining === 0 && (
        <Link
          href="/upgrade"
          className="text-xs bg-amber-500 hover:bg-amber-400 text-white px-2 py-0.5 rounded-full font-medium transition-colors"
        >
          Upgrade
        </Link>
      )}
    </div>
  );
}
