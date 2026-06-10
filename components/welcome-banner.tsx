"use client";

import { useState, useEffect } from "react";
import { X, Zap, FileText, BookOpen, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "obs_ready_welcomed_v1";

export function WelcomeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) setVisible(true);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* noop */ }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="mb-6 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-5 relative overflow-hidden"
        >
          {/* Decorative background glow */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-violet-200/30 blur-2xl pointer-events-none" />

          {/* Dismiss button */}
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 text-indigo-300 hover:text-indigo-600 transition-colors p-1 rounded-lg hover:bg-indigo-100"
            aria-label="Dismiss welcome message"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md flex-shrink-0">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-indigo-900 text-base">Welcome to Observation Ready AI! 👋</h3>
              <p className="text-indigo-600 text-xs">Your AI-powered educator toolkit — here&apos;s how to get started:</p>
            </div>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                icon: FileText,
                step: "1",
                title: "Build a Lesson Plan",
                desc: "Enter your subject, grade, and topic — then let AI generate a full observation-ready plan.",
                color: "bg-indigo-500",
              },
              {
                icon: BookOpen,
                step: "2",
                title: "Answer Your IPDP",
                desc: "Use the IPDP Assistant to get AI-guided help crafting strong professional development responses.",
                color: "bg-emerald-500",
              },
              {
                icon: Upload,
                step: "3",
                title: "Upload Your Standards",
                desc: "Add your district's standards and IPDP questions once — access them anywhere in the app.",
                color: "bg-violet-500",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-3 bg-white/70 rounded-xl p-3 border border-indigo-100">
                <div className={`w-7 h-7 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <item.icon className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <p className="text-indigo-900 text-xs font-semibold">{item.title}</p>
                  <p className="text-indigo-600 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-indigo-400 text-xs mt-3 text-center">
            All data stays on your device — nothing is stored on our servers.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
