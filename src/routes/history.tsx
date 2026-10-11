"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { GestureHistory } from "@/components/dashboard/GestureHistory";
import { Sparkle } from "@/components/ui/doodles";
import { loadHistory } from "@/lib/historyStore";
import type { HistoryEntry } from "@/lib/gestures";
import { cn } from "@/lib/utils";

const title = "History — SignSpeak AI";
const description =
  "Review every translated phrase, its source gesture, confidence score and time — and replay any of them as speech.";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(loadHistory());
  }, []);

  const total = entries.length;
  const average =
    total > 0 ? Math.round((entries.reduce((sum, e) => sum + e.confidence, 0) / total) * 100) : 0;

  return (
    <div className="min-h-dvh bg-soft">
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 py-14">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Conversation{" "}
          <mark className="rounded-md bg-yellow px-1 text-yellow-foreground">history</mark>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Stored locally on this device. Clear it any time from Settings.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Phrases translated", value: String(total), tilt: "-rotate-2" },
            { label: "Average confidence", value: `${average}%`, tilt: "rotate-1" },
            { label: "Storage", value: "This device only", tilt: "-rotate-1" },
          ].map((s) => (
            <div
              key={s.label}
              className={cn(
                "relative overflow-hidden rounded-[24px] border border-border bg-card p-5 shadow-sticker",
                s.tilt,
              )}
            >
              <Sparkle className="absolute right-3 top-3 h-4 w-4 text-yellow" aria-hidden="true" />
              <p className="font-display text-2xl font-bold tabular-nums">{s.value}</p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <GestureHistory entries={entries} className="mt-6" height="h-[26rem]" />
      </main>
      <Footer />
    </div>
  );
}
