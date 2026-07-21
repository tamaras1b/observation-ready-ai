"use client";

import { motion } from "framer-motion";
import { Smartphone, Share, Plus, CheckCircle, Download, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const iosSteps = [
  { icon: Share, title: "Open in Safari", desc: "Go to observationreadyai.app in the Safari app (this only works in Safari, not Chrome)." },
  { icon: Share, title: "Tap the Share icon", desc: "It's the square with an arrow pointing up, at the bottom of the screen." },
  { icon: Plus, title: "Tap “Add to Home Screen”", desc: "Scroll down in the share menu until you see this option." },
  { icon: CheckCircle, title: "Tap “Add”", desc: "The app icon now appears on your home screen — open it any time, just like a regular app." },
];

const androidSteps = [
  { icon: Download, title: "Get it from Google Play", desc: "Search “Observation Ready AI” in the Play Store, or use the link on this page once it's live." },
  { icon: CheckCircle, title: "Install like any app", desc: "Tap Install — no extra steps needed." },
];

export default function InstallPage() {
  return (
    <div className="p-8 pb-24">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
            <Smartphone className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Install the App</h1>
        </div>
        <p className="text-slate-500 text-sm ml-[52px]">
          Get Observation Ready AI on your phone — free, in seconds, no App Store required.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
        {/* iPhone */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="h-full border-indigo-100">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">iPhone / iPad</CardTitle>
                  <Badge className="mt-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Free &middot; Instant &middot; No App Store</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {iosSteps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{step.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2 items-start mt-2">
                <span className="text-amber-500 text-sm flex-shrink-0">⚠️</span>
                <p className="text-xs text-amber-800">
                  Must be done in <span className="font-semibold">Safari</span> — Chrome on iPhone can&apos;t add a proper home screen app icon.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Android */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full border-emerald-100">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Android</CardTitle>
                  <Badge className="mt-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Google Play Store</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {androidSteps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{step.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mt-2">
                <p className="text-xs text-slate-600">
                  Currently in testing — public release coming soon! Ask Tamara for early access.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
