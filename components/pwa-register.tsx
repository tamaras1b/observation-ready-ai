"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          console.log("Service worker registered:", reg.scope);
        })
        .catch((err) => {
          console.error("Service worker registration failed:", err);
        });
    });
  }, []);

  return null; // renders nothing — just registers the SW
}
