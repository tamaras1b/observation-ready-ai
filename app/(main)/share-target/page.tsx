"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Zap, Share2, ArrowRight } from "lucide-react";
import { Suspense } from "react";

function ShareTargetContent() {
  const router     = useRouter();
  const params     = useSearchParams();
  const [shared, setShared] = useState<{ title: string; text: string; url: string } | null>(null);

  useEffect(() => {
    const title = params.get("title") || "";
    const text  = params.get("text")  || "";
    const url   = params.get("url")   || "";

    if (title || text || url) {
      setShared({ title, text, url });

      // Store in sessionStorage so the lesson plan page can pre-fill from it
      sessionStorage.setItem(
        "shared_content",
        JSON.stringify({ title, text, url })
      );

      // Redirect to lesson plan builder after a short delay
      setTimeout(() => router.push("/lesson-plan"), 1800);
    } else {
      router.push("/");
    }
  }, [params, router]);

  if (!shared) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-md w-full text-center space-y-6">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <div className="bg-indigo-500 rounded-lg p-2">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="text-white font-bold text-lg">Observation Ready AI</span>
        </div>

        {/* Icon */}
        <div className="bg-indigo-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
          <Share2 className="h-8 w-8 text-indigo-300" />
        </div>

        <div className="space-y-2">
          <h1 className="text-white text-xl font-semibold">Content Received!</h1>
          <p className="text-indigo-200 text-sm">
            Opening your Lesson Plan Builder with the shared content…
          </p>
        </div>

        {/* Preview of what was shared */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left space-y-2">
          {shared.title && (
            <p className="text-white text-sm font-medium truncate">{shared.title}</p>
          )}
          {shared.text && (
            <p className="text-indigo-200 text-xs line-clamp-3">{shared.text}</p>
          )}
          {shared.url && (
            <p className="text-indigo-400 text-xs truncate">{shared.url}</p>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 text-indigo-300 text-sm">
          <ArrowRight className="h-4 w-4 animate-pulse" />
          <span>Redirecting to Lesson Plan Builder…</span>
        </div>

        <p className="text-indigo-400 text-xs">Brought to you by Tamand Inc.</p>
      </div>
    </div>
  );
}

export default function ShareTargetPage() {
  return (
    <Suspense>
      <ShareTargetContent />
    </Suspense>
  );
}
