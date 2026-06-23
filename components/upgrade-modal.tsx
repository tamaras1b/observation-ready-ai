"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Star, X, Check, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import { redeemPromoCode } from "@/lib/pro-status";
import { FREE_DAILY_LIMIT } from "@/lib/pro-status";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  onProActivated: () => void;
}

export function UpgradeModal({ open, onClose, onProActivated }: UpgradeModalProps) {
  const [promoCode, setPromoCode]   = useState("");
  const [promoMsg, setPromoMsg]     = useState("");
  const [promoError, setPromoError] = useState(false);
  const [showPromo, setShowPromo]   = useState(false);

  function handleRedeem() {
    const result = redeemPromoCode(promoCode);
    setPromoMsg(result.message);
    setPromoError(!result.success);
    if (result.success) {
      setTimeout(() => { onProActivated(); onClose(); }, 1500);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 border border-indigo-700/50 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 pb-4">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-indigo-300 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="bg-amber-500 rounded-lg p-2">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-white font-bold text-lg">Daily Limit Reached</span>
              </div>

              <p className="text-indigo-200 text-sm">
                You've used all <span className="text-white font-semibold">{FREE_DAILY_LIMIT} free AI suggestions</span> for today.
                Upgrade to Pro for unlimited access — no limits, ever.
              </p>
            </div>

            {/* Pro benefits */}
            <div className="px-6 pb-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                {[
                  "Unlimited AI suggestions every day",
                  "All lesson plan fields fully generated",
                  "Unlimited IPDP goal & response writing",
                  "PDF export for all plans",
                  "Priority support from Tamand Inc.",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-sm text-indigo-100">
                    <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing CTAs */}
            <div className="px-6 pb-4 space-y-3">
              {/* Annual — best value */}
              <Link
                href="/upgrade"
                className="flex items-center justify-between w-full bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-xl px-4 py-3 group"
              >
                <div>
                  <div className="text-white font-semibold text-sm flex items-center gap-2">
                    Annual Plan
                    <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">Best Value</span>
                  </div>
                  <div className="text-indigo-200 text-xs">$49.99/year · saves $34 vs monthly</div>
                </div>
                <ArrowRight className="h-4 w-4 text-indigo-200 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Monthly */}
              <Link
                href="/upgrade"
                className="flex items-center justify-between w-full bg-white/10 hover:bg-white/15 border border-white/20 transition-colors rounded-xl px-4 py-3 group"
              >
                <div>
                  <div className="text-white font-semibold text-sm">Monthly Plan</div>
                  <div className="text-indigo-300 text-xs">$6.99/month · cancel anytime</div>
                </div>
                <ArrowRight className="h-4 w-4 text-indigo-300 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Promo code toggle */}
            <div className="px-6 pb-6">
              <button
                onClick={() => setShowPromo(!showPromo)}
                className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-200 text-xs transition-colors"
              >
                <Tag className="h-3.5 w-3.5" />
                Have a promo code?
              </button>

              <AnimatePresence>
                {showPromo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 flex gap-2"
                  >
                    <input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="ENTER CODE"
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder:text-indigo-400 focus:outline-none focus:border-indigo-400 uppercase"
                    />
                    <button
                      onClick={handleRedeem}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-3 py-2 rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {promoMsg && (
                <p className={`text-xs mt-1.5 ${promoError ? "text-rose-400" : "text-emerald-400"}`}>
                  {promoMsg}
                </p>
              )}

              <p className="text-indigo-500 text-xs mt-3 text-center">
                Your free suggestions reset tomorrow at midnight.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
