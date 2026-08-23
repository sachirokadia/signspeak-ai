"use client";

import { Camera, CameraOff, RefreshCcw, ScanLine } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Status = "idle" | "starting" | "live" | "error";

export function WebcamPanel({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: (next: boolean) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [mirrored, setMirrored] = useState(true);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus("idle");
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      setStatus("starting");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setStatus("live");
      } catch {
        if (cancelled) return;
        setStatus("error");
        setMessage(
          "Camera access was blocked. Enable permissions in your browser to start translating.",
        );
      }
    }

    if (active) start();
    else stop();

    return () => {
      cancelled = true;
    };
  }, [active, stop]);

  useEffect(() => stop, [stop]);

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
                {status === "error"
                  ? message
                  : "Turn on the camera to begin real-time translation."}
              </p>
            </div>
          </div>
        ) : null}

        {status === "live" ? (
          <>
            <motion.div
              className="pointer-events-none absolute inset-x-12 inset-y-10 rounded-3xl border-2 border-white/50"
              animate={{ opacity: [0.3, 0.85, 0.3] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="pointer-events-none absolute inset-x-12 h-px bg-white/70"
              animate={{ top: ["12%", "86%", "12%"] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Live
            </div>
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-3 divide-x divide-border border-t border-border text-center">
        {[
          ["Frame rate", status === "live" ? "58 fps" : "—"],
          ["Landmarks", status === "live" ? "21 / hand" : "—"],
          ["Processing", "On-device"],
        ].map(([label, value]) => (
          <div key={label} className="px-3 py-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-sm font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
