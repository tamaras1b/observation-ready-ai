// ─── Observation Ready AI — Pro Status & Freemium Limits ─────────────────────

export const FREE_DAILY_LIMIT = 3; // AI suggestions per day on free tier

// Promo codes Tamara can hand out manually (update as needed)
const VALID_PROMO_CODES = ["TAMANDPRO2024", "OBSREADY1", "TEACHERPRO"];

// ── Pro status ────────────────────────────────────────────────────────────────
export function isPro(): boolean {
  if (typeof window === "undefined") return false;
  const status = localStorage.getItem("obs_pro_status");
  const expiry = localStorage.getItem("obs_pro_expiry");
  if (status !== "true") return false;
  if (expiry && Date.now() > parseInt(expiry)) {
    localStorage.removeItem("obs_pro_status");
    localStorage.removeItem("obs_pro_expiry");
    return false;
  }
  return true;
}

export function activatePro(expiryMs?: number): void {
  localStorage.setItem("obs_pro_status", "true");
  if (expiryMs) {
    localStorage.setItem("obs_pro_expiry", (Date.now() + expiryMs).toString());
  }
}

export function deactivatePro(): void {
  localStorage.removeItem("obs_pro_status");
  localStorage.removeItem("obs_pro_expiry");
}

// ── Promo code redemption ─────────────────────────────────────────────────────
export function redeemPromoCode(code: string): { success: boolean; message: string } {
  const normalized = code.trim().toUpperCase();
  if (VALID_PROMO_CODES.includes(normalized)) {
    activatePro(30 * 24 * 60 * 60 * 1000); // 30-day trial
    return { success: true, message: "🎉 Pro access activated for 30 days!" };
  }
  return { success: false, message: "Invalid code. Please check and try again." };
}
