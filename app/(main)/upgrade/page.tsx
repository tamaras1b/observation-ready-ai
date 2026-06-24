"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Zap, Star, Check, Tag, ArrowRight,
  BookOpen, FileText, Infinity, Shield,
} from "lucide-react";
import { isPro, activatePro, redeemPromoCode, FREE_DAILY_LIMIT } from "@/lib/pro-status";
import { getUsageToday } from "@/lib/usage-tracker";
import Link from "next/link";

// ── Replace these with your real Stripe Payment Link URLs ──────────────────────
// 1. Create a free Stripe account at https://stripe.com
// 2. Go to Products → Add Product → "Observation Ready AI Pro"
// 3. Add two prices: $6.99/month and $49.99/year
// 4. Create Payment Links for each → paste the URLs below
const STRIPE_MONTHLY_URL = "https://buy.stripe.com/dRm4gB8Wx4Fq62a5Wv2B200";
const STRIPE_ANNUAL_URL  = "https://buy.stripe.com/fZu7sN5Klb3O1LU3On2B201";

// Opens a URL in the device's real browser — required for TWA/Android Play Store compliance.
// Google Play policy prohibits in-app payment flows; Stripe must open externally.
function openExternal(url: string) {
  // In a TWA (Android), window.open with _blank forces the system browser
  const win = window.open(url, "_blank", "noopener,noreferrer");
  // Fallback: if pop-up was blocked, navigate directly
  if (!win) { window.location.href = url; }
}
// ─────────────────────────────────────────────────────────────────────────────

const FREE_FEATURES = [
  `${FREE_DAILY_LIMIT} AI suggestions per day`,
  "Lesson Plan Builder",
  "IPDP Response Writer",
  "Standards Manager",
  "PDF Export",
  "Save & manage plans",
];

const PRO_FEATURES = [
  "Unlimited AI suggestions — every day",
  "All Lesson Plan fields auto-generated",
  "Unlimited IPDP goal & response writing",
  "PDF export for all plans",
  "Priority support from Tamand Inc.",
  "All future features included",
];

export default function UpgradePage() {
  const [proStatus, setProStatus]   = useState(false);
  const [usedToday, setUsedToday]   = useState(0);
  const [promoCode, setPromoCode]   = useState("");
  const [promoMsg, setPromoMsg]     = useState("");
  const [promoError, setPromoError] = useState(false);
  const [billing, setBilling]       = useState<"monthly" | "annual">("annual");

  useEffect(() => {
    setProStatus(isPro());
    setUsedToday(getUsageToday());
  }, []);

  function handleRedeem() {
    const result = redeemPromoCode(promoCode);
    setPromoMsg(result.message);
    setPromoError(!result.success);
    if (result.success) {
      setTimeout(() => setProStatus(true), 1000);
    }
  }

  const stripeUrl = billing === "annual" ? STRIPE_ANNUAL_URL : STRIPE_MONTHLY_URL;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 p-6">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="bg-indigo-600 rounded-lg p-2">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">Observation Ready AI</span>
          </div>
          <h1 className="text-3xl font-bold text-white">
            Upgrade to <span className="text-amber-400">Pro</span>
          </h1>
          <p className="text-indigo-200 max-w-md mx-auto">
            Unlimited AI-powered lesson planning and IPDP tools — built for teachers who mean business.
          </p>
        </motion.div>

        {/* Already Pro banner */}
        {proStatus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-4 flex items-center gap-3"
          >
            <Star className="h-5 w-5 text-emerald-400 fill-emerald-400" />
            <div>
              <p className="text-emerald-300 font-semibold">You're already on Pro!</p>
              <p className="text-emerald-400/70 text-sm">Enjoy unlimited AI suggestions.</p>
            </div>
            <Link href="/" className="ml-auto text-emerald-300 hover:text-white text-sm flex items-center gap-1">
              Go to app <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        )}

        {/* Billing toggle */}
        {!proStatus && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                billing === "monthly"
                  ? "bg-indigo-600 text-white"
                  : "text-indigo-300 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                billing === "annual"
                  ? "bg-indigo-600 text-white"
                  : "text-indigo-300 hover:text-white"
              }`}
            >
              Annual
              <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">Save 40%</span>
            </button>
          </div>
        )}

        {/* Pricing cards */}
        {!proStatus && (
          <div className="grid md:grid-cols-2 gap-4">

            {/* Free card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4"
            >
              <div>
                <p className="text-indigo-300 text-sm font-medium">Current Plan</p>
                <h2 className="text-2xl font-bold text-white mt-1">Free</h2>
                <p className="text-indigo-300 text-sm mt-1">
                  {FREE_DAILY_LIMIT - usedToday > 0
                    ? `${FREE_DAILY_LIMIT - usedToday} AI suggestion${FREE_DAILY_LIMIT - usedToday !== 1 ? "s" : ""} left today`
                    : "Daily limit reached — resets tomorrow"}
                </p>
              </div>

              <div className="space-y-2">
                {FREE_FEATURES.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-indigo-200">
                    <Check className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <div className="w-full bg-white/10 border border-white/20 rounded-xl py-3 text-center text-indigo-300 text-sm">
                  Your current plan
                </div>
              </div>
            </motion.div>

            {/* Pro card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-gradient-to-br from-indigo-600 to-violet-600 border border-indigo-400/30 rounded-2xl p-6 space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                MOST POPULAR
              </div>

              <div>
                <p className="text-indigo-200 text-sm font-medium">Upgrade to</p>
                <h2 className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
                  Pro
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                </h2>
                <div className="mt-1">
                  {billing === "annual" ? (
                    <div>
                      <span className="text-3xl font-bold text-white">$49.99</span>
                      <span className="text-indigo-200 text-sm">/year</span>
                      <span className="text-indigo-200 text-xs ml-2 line-through">$83.88</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-3xl font-bold text-white">$6.99</span>
                      <span className="text-indigo-200 text-sm">/month</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {PRO_FEATURES.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-white">
                    <Check className="h-4 w-4 text-emerald-300 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => openExternal(stripeUrl)}
                  className="flex items-center justify-center gap-2 w-full bg-white text-indigo-700 hover:bg-indigo-50 font-semibold rounded-xl py-3 text-sm transition-colors"
                >
                  <Zap className="h-4 w-4" />
                  Upgrade Now — {billing === "annual" ? "$49.99/yr" : "$6.99/mo"}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <p className="text-center text-indigo-200/60 text-xs mt-2">
                  Secure checkout · Cancel anytime
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Promo code */}
        {!proStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-indigo-400" />
              <p className="text-white text-sm font-medium">Have a promo code?</p>
            </div>
            <div className="flex gap-2">
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="ENTER CODE"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-indigo-400 focus:outline-none focus:border-indigo-400 uppercase tracking-widest"
              />
              <button
                onClick={handleRedeem}
                disabled={!promoCode.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm px-4 py-2.5 rounded-lg font-medium transition-colors"
              >
                Apply
              </button>
            </div>
            {promoMsg && (
              <p className={`text-sm mt-2 ${promoError ? "text-rose-400" : "text-emerald-400"}`}>
                {promoMsg}
              </p>
            )}
            <p className="text-indigo-400 text-xs mt-2">
              Contact <a href="mailto:tamand.inc79@gmail.com" className="underline hover:text-indigo-200">tamand.inc79@gmail.com</a> to request a promo code.
            </p>
          </motion.div>
        )}

        {/* Features comparison */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-3 gap-4 text-center"
        >
          {[
            { icon: BookOpen, title: "AI Lesson Plans", desc: "Bloom's Taxonomy-aligned suggestions" },
            { icon: FileText, title: "IPDP Writing", desc: "Professional goal & reflection writing" },
            { icon: Shield, title: "Privacy First", desc: "All data stays on your device" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
              <Icon className="h-6 w-6 text-indigo-400 mx-auto" />
              <p className="text-white text-sm font-medium">{title}</p>
              <p className="text-indigo-300 text-xs">{desc}</p>
            </div>
          ))}
        </motion.div>

        <p className="text-center text-indigo-500 text-xs pb-4">
          Brought to you by <span className="text-indigo-400">Tamand Inc.</span> · Jacksonville, FL
        </p>
      </div>
    </div>
  );
}
