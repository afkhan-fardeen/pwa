"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Shows when a new service worker is waiting; user confirms to skipWaiting and reload.
 */
export function SwUpdatePrompt() {
  const [visible, setVisible] = useState(false);
  const regRef = useRef<ServiceWorkerRegistration | null>(null);

  const applyUpdate = useCallback(() => {
    const reg = regRef.current;
    if (!reg?.waiting) return;
    const handler = () => {
      navigator.serviceWorker.removeEventListener("controllerchange", handler);
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", handler);
    reg.waiting.postMessage({ type: "SKIP_WAITING" });
    setVisible(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    let cancelled = false;

    const init = async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg || cancelled) return;
      regRef.current = reg;
      if (reg.waiting) setVisible(true);

      reg.addEventListener("updatefound", () => {
        const nw = reg.installing;
        if (!nw) return;
        nw.addEventListener("statechange", () => {
          if (nw.state === "installed" && navigator.serviceWorker.controller) {
            setVisible(true);
          }
        });
      });
    };
    void init();

    const interval = setInterval(() => {
      void navigator.serviceWorker.getRegistration().then((r) => r?.update());
    }, 60 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed right-4 bottom-4 left-4 z-[100] flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 shadow-lg sm:left-auto sm:max-w-sm dark:border-gray-700 dark:bg-gray-900">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        A new version of Qalbee is ready.
      </p>
      <Button type="button" onClick={applyUpdate} className="w-full">
        Update and reload
      </Button>
    </div>
  );
}
