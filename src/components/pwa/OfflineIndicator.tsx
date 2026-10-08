"use client";

import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

/** Small banner shown while the browser reports no connectivity. */
export function OfflineIndicator() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const goOffline = () => setOnline(false);
    const goOnline = () => setOnline(true);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (online) return null;

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 bg-amber-400/95 px-4 py-2 text-center text-xs font-medium text-amber-950"
    >
      <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
      You&apos;re offline — gesture translation keeps working on-device.
    </div>
  );
}
