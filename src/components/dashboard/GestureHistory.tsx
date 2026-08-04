"use client";

import { AnimatePresence, motion } from "motion/react";
import { History as HistoryIcon, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatTime, type HistoryEntry } from "@/lib/gestures";

export function GestureHistory({
  entries,
  className = "",
  height = "h-80",
}: {
  entries: HistoryEntry[];
  className?: string;
  height?: string;
}) {
  function replay(entry: HistoryEntry) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(entry.phrase);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <section className={`glass-panel rounded-3xl ${className}`}>
      <header className="flex items-center gap-2 border-b border-border px-6 py-4">
        <HistoryIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-sm font-semibold">Gesture history</h2>
        <span className="ml-auto text-xs text-muted-foreground">{entries.length} entries</span>
      </header>

      <ScrollArea className={height}>
        <ul className="divide-y divide-border">
          <AnimatePresence initial={false}>
            {entries.map((entry) => (
              <motion.li
                key={entry.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-6 py-4 transition-colors hover:bg-surface"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{entry.phrase}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {entry.gesture} · {formatTime(entry.at)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                    {Math.round(entry.confidence * 100)}%
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Replay ${entry.phrase}`}
                    className="min-h-11 min-w-11 rounded-full"
                    onClick={() => replay(entry)}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
          {entries.length === 0 ? (
            <li className="px-6 py-10 text-center text-sm text-muted-foreground">
              Recognised phrases will appear here.
            </li>
          ) : null}
        </ul>
      </ScrollArea>
    </section>
  );
}
