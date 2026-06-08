"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, BookOpen, Star, ArrowRight, CheckCircle, Upload, Zap, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const quickActions = [
  {
    href: "/lesson-plan",
    title: "Lesson Plan Builder",
    description: "Build a complete observation-ready lesson plan with AI-generated objectives, lesson phases, and differentiation strategies — tailored to your subject and grade.",
    icon: FileText,
    color: "bg-indigo-500",
    badge: "AI-Powered",
  },
  {
    href: "/ipdp",
    title: "IPDP Assistant",
    description: "Get AI-guided help answering IPDP questions, generate SMART goals, and craft strong professional growth responses with sample answers.",
    icon: BookOpen,
    color: "bg-emerald-500",
    badge: "AI-Powered",
  },
  {
    href: "/standards",
    title: "My Standards & Questions",
    description: "Upload your state/district standards and your district's custom IPDP questions. They'll be available across all tools for quick access.",
    icon: Upload,
    color: "bg-violet-500",
    badge: null,
  },
];

const aiFeatures = [
  { icon: Zap, label: "AI Lesson Suggestions", desc: "Auto-generates objectives, hooks, instruction, practice, closure, and differentiation based on your subject and grade level." },
  { icon: TrendingUp, label: "AI IPDP Goal Builder", desc: "Generates SMART goal language and evidence ideas personalized to your professional growth focus area." },
  { icon: BookOpen, label: "AI IPDP Response Guidance", desc: "Click any IPDP question to get AI-written guidance on how to craft a strong, evaluator-ready response." },
  { icon: Upload, label: "Custom Standards & Questions", desc: "Upload your district's exact standards and IPDP form questions so they're always at your fingertips." },
];

const tips = [
  "Fill in Subject, Grade, and Topic — then click 'Get AI Suggestions' to populate your entire lesson plan.",
  "Upload your state standards once in 'My Standards & Questions' — then browse and insert them in any lesson plan.",
  "Use the AI IPDP Goal Builder to generate SMART goal starters aligned to your professional growth focus.",
  "Your district's IPDP questions appear in the 'My District Questions' tab after uploading them to the library.",
];

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Observation Ready AI</h1>
            <p className="text-slate-500 text-sm">Your AI-powered educator toolkit — lesson plans, IPDP support, and standards in one place.</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {quickActions.map((action, i) => (
          <motion.div key={action.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}>
            <Link href={action.href}>
              <Card className="h-full border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center shadow-sm mb-3`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    {action.badge && <Badge variant="secondary" className="text-xs bg-indigo-100 text-indigo-700 border-0">{action.badge}</Badge>}
                  </div>
                  <CardTitle className="text-base text-slate-900 group-hover:text-indigo-700 transition-colors">{action.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{action.description}</p>
                  <div className="flex items-center text-indigo-600 text-sm font-medium gap-1 group-hover:gap-2 transition-all">
                    Open <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* AI Features Grid */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">AI Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {aiFeatures.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.05 }}>
              <div className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100">
                <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <f.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-indigo-900">{f.label}</p>
                  <p className="text-xs text-indigo-700 mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Start Tips</h2>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="pt-5">
            <div className="space-y-3">
              {tips.map((tip, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
