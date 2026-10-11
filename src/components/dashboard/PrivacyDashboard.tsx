"use client";

import { Camera, Cpu, Database, Trash2 } from "lucide-react";
import { StickerChip } from "@/components/ui/sticker-chip";
import { Sparkle } from "@/components/ui/doodles";
import { cn } from "@/lib/utils";

/**
 * Privacy dashboard — shows exactly what happens to the user's data.
 * The whole point is verifiability: every claim here maps to real code.
 */
const FLOW = [
  {
    icon: Camera,
    title: "Camera frame",
    body: "Captured at 30 fps by getUserMedia. Never uploaded, never stored.",
  },
  {
    icon: Cpu,
    title: "21 hand landmarks",
    body: "MediaPipe extracts anonymous skeleton points on-device (WASM). The pixels are discarded with the frame.",
  },
  {
    icon: Database,
    title: "Stays on your device",
    body: "Gesture history, custom gestures and settings live in this browser's local storage only.",
  },
  {
    icon: Trash2,
    title: "Nothing to delete remotely",
    body: "There is no account and no server copy. Clearing site data erases everything.",
  },
];

export function PrivacyDashboard() {
  return (
    <section
      aria-labelledby="privacy-heading"
      className="glass-panel relative overflow-hidden rounded-[28px] p-6 sm:p-8"
    >
      <Sparkle className="absolute right-6 top-6 h-6 w-6 text-yellow" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="privacy-heading" className="font-display text-xl font-bold">
          Your data, visualised
        </h2>
        <StickerChip tone="yellow" tilt="right">
          <span className="h-1.5 w-1.5 rounded-full bg-black" aria-hidden="true" />0 bytes uploaded
          this session
        </StickerChip>
      </div>

      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FLOW.map((step, i) => (
          <li
            key={step.title}
            className={cn(
              "relative rounded-[24px] border border-border bg-card p-5 shadow-sticker",
              i % 2 === 0 ? "-rotate-1" : "rotate-1",
            )}
          >
            <span
              className="bg-brand absolute -top-3 left-5 grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-primary-foreground shadow-sticker"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <step.icon className="h-6 w-6 text-primary" aria-hidden="true" />
            <h3 className="mt-2 text-sm font-bold">{step.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-xs text-muted-foreground">
        Network requests during a session are limited to loading the app itself and the open-source
        hand-tracking model — both cached after first load for offline use. Audit it yourself in
        DevTools → Network.
      </p>
    </section>
  );
}
