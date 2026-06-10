"use client";

import { motion } from "framer-motion";
import { Mail, MessageSquare, Zap, ExternalLink, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const CONTACT_EMAIL = "tamand.inc79@gmail.com";

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-6 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>
            <p className="text-slate-500 text-sm">We&apos;d love to hear from you</p>
          </div>
        </div>
        <Separator />
      </motion.div>

      {/* Intro */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <p className="text-slate-600 leading-relaxed">
          Observation Ready AI is built by educators, for educators. Whether you have a question,
          a suggestion, or just want to say hello — we&apos;re happy to hear from you.
        </p>
      </motion.div>

      {/* Email card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
        <Card className="border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-indigo-900 mb-1">Email Us</h2>
                <p className="text-indigo-700 text-sm mb-4">
                  Send us an email and we&apos;ll get back to you within 1–2 business days.
                </p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    {CONTACT_EMAIL}
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* What to contact us about */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-slate-600" />
              <h2 className="font-semibold text-slate-800">What to Include in Your Message</h2>
            </div>
            <div className="space-y-3">
              {[
                { emoji: "🐛", label: "Bug reports", desc: "Something not working? Tell us what happened and what you expected." },
                { emoji: "💡", label: "Feature requests", desc: "Have an idea that would help teachers? We want to hear it." },
                { emoji: "🤝", label: "School or district partnerships", desc: "Interested in bringing Observation Ready AI to your school or district?" },
                { emoji: "📣", label: "Feedback", desc: "Did something work really well — or not so well? Let us know." },
                { emoji: "❓", label: "General questions", desc: "Anything else — we're happy to help." },
              ].map((item) => (
                <div key={item.label} className="flex gap-3 items-start p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-lg flex-shrink-0">{item.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Response time */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
        <Card className="border border-emerald-200 bg-emerald-50 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-emerald-800 text-sm">Response Time</p>
                <p className="text-emerald-700 text-xs mt-0.5">
                  We typically respond within <strong>1–2 business days</strong>. During the school year, 
                  responses may occasionally take a little longer — we appreciate your patience!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tamand Inc footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center"
      >
        <div className="flex justify-center mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
        </div>
        <p className="text-slate-600 text-sm font-medium">Observation Ready AI</p>
        <p className="text-slate-400 text-xs mt-1 flex items-center justify-center gap-1">
          Made with <Heart className="h-3 w-3 text-rose-400 fill-rose-400" /> by{" "}
          <span className="font-semibold text-slate-500">Tamand Inc.</span>
        </p>
        <p className="text-slate-400 text-xs mt-1">Jacksonville, Florida</p>
      </motion.div>
    </div>
  );
}
