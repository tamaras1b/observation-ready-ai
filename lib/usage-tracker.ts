// ─── Observation Ready AI — Daily AI Usage Tracker ───────────────────────────
import { isPro, FREE_DAILY_LIMIT } from "./pro-status";

function getTodayKey(): string {
  return `obs_ai_usage_${new Date().toISOString().split("T")[0]}`;
}

export function getUsageToday(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(getTodayKey()) || "0", 10);
}

export function getRemainingToday(): number {
  if (isPro()) return Infinity;
  return Math.max(0, FREE_DAILY_LIMIT - getUsageToday());
}

export function hasReachedLimit(): boolean {
  if (isPro()) return false;
  return getUsageToday() >= FREE_DAILY_LIMIT;
}

export function incrementUsage(): void {
  if (typeof window === "undefined") return;
  const key = getTodayKey();
  const current = getUsageToday();
  localStorage.setItem(key, (current + 1).toString());
}
