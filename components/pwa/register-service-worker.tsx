"use client";

import { useEffect } from "react";

/**
 * Registers a minimal service worker so installable PWA works reliably on Chromium.
 * Does not cache API routes or sensitive data.
 */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch {
        /* ignore — optional enhancement */
      }
    };
    void register();
  }, []);

  return null;
}
