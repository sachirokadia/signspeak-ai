"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Renders children only after client-side hydration.
 *
 * Use for routes that are entirely browser-dependent (camera, WebRTC,
 * IndexedDB, Web Speech). Server-rendering such routes buys nothing and
 * risks SSR failures for browser-only module graphs; this wrapper keeps
 * server and client output identical (both render the fallback first).
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <>{children}</> : <>{fallback}</>;
}
