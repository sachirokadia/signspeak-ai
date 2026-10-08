"use client";

import { Camera, CameraOff, RefreshCcw, ScanLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCamera } from "@/hooks/useCamera";

export function WebcamPanel({
  active,
  onToggle,
  onVideoReady,
}: {
  active: boolean;
  onToggle: (next: boolean) => void;
  /** Receives the live <video> element (or null) for the vision pipeline. */
  onVideoReady: (video: HTMLVideoElement | null) => void;
}) {
  const { videoRef, status, error } = useCamera(active);
  const [mirrored, setMirrored] = useState(true);

  useEffect(() => {
    onVideoReady(status === "live" ? videoRef.current : null);
  }, [status, videoRef, onVideoReady]);

  return (
    <section className="glass-panel flex flex-col overflow-hidden rounded-3xl">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5 py-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold">Live camera</h2>
          <p className="truncate text-xs text-muted-foreground">
            {status === "live"
              ? "Tracking 21 hand landmarks · on-device"
              : status === "starting"
                ? "Requesting camera…"
                : "Camera is off"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Mirror camera"
            className="min-h-11 min-w-11 rounded-full"
            onClick={() => setMirrored((m) => !m)}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onToggle(!active)}
            className={`h-11 rounded-full px-5 ${active ? "" : "bg-brand"}`}
            variant={active ? "outline" : "default"}
          >
            {active ? (
              <CameraOff className="mr-1.5 h-4 w-4" />
            ) : (
              <Camera className="mr-1.5 h-4 w-4" />
            )}
            {active ? "Stop" : "Start camera"}
          </Button>
        </div>
      </header>

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-foreground/90">
        <video
          ref={videoRef}
          playsInline
          muted
          aria-label="Live webcam feed"
          className={`h-full w-full object-cover transition-opacity duration-500 ${status === "live" ? "opacity-100" : "opacity-0"} ${mirrored ? "scale-x-[-1]" : ""}`}
        />

        {status !== "live" ? (
          <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_35%_30%,oklch(0.6_0.18_262/0.45),transparent_65%),radial-gradient(circle_at_70%_75%,oklch(0.55_0.22_293/0.4),transparent_65%)] px-8 text-center">
            <div className="max-w-sm">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-white backdrop-blur">
                <ScanLine className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm font-medium text-white">
                {status === "error" ? error : "Turn on the camera to begin real-time translation."}
              </p>
              {status === "error" ? (
                <Button
                  variant="secondary"
                  className="mt-4 rounded-full"
                  onClick={() => onToggle(true)}
                >
                  Try again
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
