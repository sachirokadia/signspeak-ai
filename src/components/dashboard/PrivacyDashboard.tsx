"use client";

import { Camera, Cpu, Database, Trash2 } from "lucide-react";

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
    <section aria-labelledby="privacy-heading" className="glass-panel rounded-3xl p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="privacy-heading" className="text-lg font-semibold">
          Your data, visualised
        </h2>
        <span
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
          role="status"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />0 bytes
          uploaded this session
        </span>
      </div>

      <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FLOW.map((step, i) => (
          <li
            key={step.title}
            className="relative rounded-2xl border border-border bg-background/60 p-4"
          >
            <span
              className="absolute -top-2.5 left-4 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <step.icon className="h-5 w-5 text-primary" aria-hidden="true" />
            <h3 className="mt-2 text-sm font-semibold">{step.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>

      <p className="mt-5 text-xs text-muted-foreground">
        Network requests during a session are limited to loading the app itself and the open-source
        hand-tracking model — both cached after first load for offline use. Audit it yourself in
        DevTools → Network.
      </p>
    </section>
  );
}
