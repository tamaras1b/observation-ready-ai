"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    window.addEventListener("load", async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        console.log("[PWA] Service worker registered:", reg.scope);

        // ── Periodic Background Sync (refresh cache daily) ──────────────────
        if ("periodicSync" in reg) {
          try {
            const status = await navigator.permissions.query({
              // @ts-expect-error — periodicSync not yet in TS lib types
              name: "periodic-background-sync",
            });
            if (status.state === "granted") {
              // @ts-expect-error
              await reg.periodicSync.register("obs-ready-periodic-sync", {
                minInterval: 24 * 60 * 60 * 1000, // once per day
              });
              console.log("[PWA] Periodic sync registered (daily).");
            }
          } catch (err) {
            // Periodic sync not supported on this browser — that's fine
            console.log("[PWA] Periodic sync not available:", err);
          }
        }

        // ── Listen for sync messages from the SW ────────────────────────────
        navigator.serviceWorker.addEventListener("message", (event) => {
          if (event.data?.type === "SYNC_COMPLETE") {
            console.log("[PWA] Background sync complete.");
          }
          if (event.data?.type === "PERIODIC_SYNC_COMPLETE") {
            console.log("[PWA] Periodic sync complete — app shell refreshed.");
          }
        });

      } catch (err) {
        console.error("[PWA] Service worker registration failed:", err);
      }
    });
  }, []);

  return null;
}
