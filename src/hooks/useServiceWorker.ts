"use client";

import { useEffect, useState } from "react";

/**
 * Registers /sw.js once. Returns true when a worker is in control —
 * the thing that makes the offline claim real.
 */
export function useServiceWorker(): boolean {
  const [controlled, setControlled] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    let cancelled = false;
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {
        if (!cancelled) setControlled(true);
      })
      .catch(() => {
        if (!cancelled) setControlled(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return controlled;
}
