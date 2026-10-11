"use client";

import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Navbar } from "@/components/site/Navbar";
import { SkipLink } from "@/components/a11y/SkipLink";
import { StickerChip } from "@/components/ui/sticker-chip";
import { Sparkle, Squiggle } from "@/components/ui/doodles";
import { loadHistory } from "@/lib/historyStore";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import type { HistoryEntry } from "@/lib/gestures";
import { cn } from "@/lib/utils";

const title = "Insights — SignSpeak AI";
const description =
  "Your signing activity: gestures per day, confidence trends and most-used signs.";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: InsightsPage,
});

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function InsightsPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useServiceWorker();

  useEffect(() => {
    setEntries(loadHistory());
  }, []);

  const { daily, topGestures, totals } = useMemo(() => {
    const days: { date: string; label: string; count: number; confSum: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        date: dayKey(d),
        label: d.toLocaleDateString([], { month: "short", day: "numeric" }),
        count: 0,
        confSum: 0,
      });
    }
    const byDay = new Map(days.map((d) => [d.date, d]));
    const byGesture = new Map<string, number>();
    let confTotal = 0;

    for (const e of entries) {
      const at = e.at instanceof Date ? e.at : new Date(e.at);
      const bucket = byDay.get(dayKey(at));
      if (bucket) {
        bucket.count += 1;
        bucket.confSum += e.confidence;
      }
      byGesture.set(e.gesture, (byGesture.get(e.gesture) ?? 0) + 1);
      confTotal += e.confidence;
    }

    const daily = days.map((d) => ({
      label: d.label,
      gestures: d.count,
      avgConfidence: d.count > 0 ? Math.round((d.confSum / d.count) * 100) : null,
    }));
    const topGestures = [...byGesture.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([gesture, count]) => ({ gesture, count }));
    const totals = {
      gestures: entries.length,
      avgConfidence: entries.length > 0 ? Math.round((confTotal / entries.length) * 100) : 0,
      daysActive: days.filter((d) => d.count > 0).length,
    };
    return { daily, topGestures, totals };
  }, [entries]);

  return (
    <div className="min-h-dvh bg-soft">
      <SkipLink />
      <Navbar />
      <main id="main-content" className="mx-auto max-w-7xl px-5 py-10">
        <h1 className="font-display flex items-center gap-2 text-3xl font-bold sm:text-4xl">
          <BarChart3 className="h-8 w-8" aria-hidden="true" />
          <span>
            Your signing{" "}
            <mark className="rounded-md bg-yellow px-1 text-yellow-foreground">insights</mark>
          </span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Computed on-device from your saved history — nothing leaves the browser.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {[
            { label: "Gestures translated", value: String(totals.gestures), tilt: "-rotate-1" },
            { label: "Average confidence", value: `${totals.avgConfidence}%`, tilt: "rotate-1" },
            { label: "Active days (14d)", value: String(totals.daysActive), tilt: "-rotate-2" },
          ].map((s) => (
            <div
              key={s.label}
              className={cn(
                "glass-panel relative overflow-hidden rounded-[28px] p-6 shadow-sticker",
                s.tilt,
              )}
            >
              <Sparkle className="absolute right-4 top-4 h-5 w-5 text-yellow" aria-hidden="true" />
              <p className="font-display text-4xl font-bold tabular-nums">{s.value}</p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <section
            aria-labelledby="daily-heading"
            className="glass-panel relative overflow-hidden rounded-[28px] p-6"
          >
            <Squiggle className="absolute right-5 top-5 h-3 w-14 text-primary" />
            <h2 id="daily-heading" className="text-sm font-bold">
              <StickerChip tone="violet" tilt="none">
                Gestures per day
              </StickerChip>
            </h2>
            <div className="mt-3 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={daily} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={2} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="gestures" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section
            aria-labelledby="conf-heading"
            className="glass-panel relative overflow-hidden rounded-[28px] p-6"
          >
            <Squiggle className="absolute right-5 top-5 h-3 w-14 text-yellow" />
            <h2 id="conf-heading" className="text-sm font-bold">
              <StickerChip tone="yellow" tilt="none">
                Confidence trend (%)
              </StickerChip>
            </h2>
            <div className="mt-3 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={daily} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={2} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="avgConfidence"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <section aria-labelledby="top-heading" className="glass-panel mt-5 rounded-[28px] p-6">
          <h2 id="top-heading" className="text-sm font-bold">
            Most used gestures
          </h2>
          {topGestures.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Translate some gestures on the dashboard and they&apos;ll show up here.
            </p>
          ) : (
            <ol className="mt-3 flex flex-col gap-2">
              {topGestures.map((g, i) => (
                <li
                  key={g.gesture}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm"
                >
                  <span>
                    <span className="mr-2 text-muted-foreground tabular-nums">{i + 1}.</span>
                    <strong>{g.gesture}</strong>
                  </span>
                  <StickerChip tone={i === 0 ? "yellow" : "ghost"} tilt={i % 2 ? "right" : "left"}>
                    {g.count}×
                  </StickerChip>
                </li>
              ))}
            </ol>
          )}
        </section>
      </main>
    </div>
  );
}
