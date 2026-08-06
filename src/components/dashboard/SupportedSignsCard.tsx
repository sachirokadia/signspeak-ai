"use client";

import { BookOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getVocabulary } from "@/services/gesture/gestureVocabulary";

/**
 * SupportedSignsCard
 * Lists every gesture in the active vocabulary with its mapped phrase.
 * Populated automatically from getVocabulary() — no hardcoded values.
 * When new gestures are added via loadCustomVocabulary() or to
 * BUILT_IN_VOCABULARY, this card reflects them without any code changes.
 */
export function SupportedSignsCard() {
  // Read from the vocabulary service on every render so custom gestures
  // loaded at runtime are always reflected.
  const vocabulary = getVocabulary();

  return (
    <section
      aria-label="Supported signs"
      className="glass-panel flex flex-col overflow-hidden rounded-3xl"
    >
      {/* Header */}
      <header className="flex items-center gap-2 border-b border-border px-5 py-4">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground"
          aria-hidden="true"
        >
          <BookOpen className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">Supported signs</h2>
          <p className="text-xs text-muted-foreground">
            {vocabulary.length} gesture{vocabulary.length === 1 ? "" : "s"} available
          </p>
        </div>
      </header>

      {/* Scrollable vocabulary list */}
      <ScrollArea className="h-52">
        <ul className="divide-y divide-border/60" aria-label="Gesture vocabulary">
          {vocabulary.map((entry) => (
            <li
              key={entry.gestureId}
              className="flex items-center justify-between gap-3 px-5 py-3
                         transition-colors duration-150 hover:bg-surface"
            >
              {/* Gesture display name */}
              <span className="text-xs font-semibold text-foreground">
                {entry.displayName}
              </span>

              {/* Separator */}
              <span className="mx-1 h-px flex-1 bg-border/50" aria-hidden="true" />

              {/* Mapped phrase */}
              <span className="shrink-0 text-xs text-muted-foreground">
                {entry.phrase}
              </span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </section>
  );
}
