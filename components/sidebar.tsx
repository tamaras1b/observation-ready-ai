"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, BookOpen, Star, Zap, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/lesson-plan", label: "Lesson Plan Builder", icon: FileText },
  { href: "/ipdp", label: "IPDP Assistant", icon: BookOpen },
  { href: "/standards", label: "My Standards & Questions", icon: Upload },
  { href: "/saved", label: "Saved Plans", icon: Star },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 min-h-screen border-r bg-gradient-to-b from-indigo-950 to-indigo-900 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-indigo-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-tight">Observation Ready AI</h1>
            <p className="text-indigo-400 text-xs">Educator Tools</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
              pathname === item.href
                ? "bg-indigo-600 text-white shadow-md"
                : "text-indigo-300 hover:bg-indigo-800 hover:text-white"
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-indigo-800">
        <div className="rounded-lg bg-indigo-800/50 p-3">
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-indigo-400" />
            <p className="text-indigo-300 text-xs font-medium">AI-Powered Planning</p>
          </div>
          <p className="text-indigo-400 text-xs mt-0.5">School Year 2026–2027</p>
        </div>
      </div>
    </aside>
  );
}
