"use client";

import { MessageSquareText, Trash2, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SentenceWord = {
  id: string;
  text: string;
};

/**
 * Composes confirmed gestures into a speakable sentence. Each stable
 * gesture appends a word chip; the user curates the message, then speaks it.
 */
export function SentenceBuilder({
  words,
  onRemoveWord,
  onClear,
  onSpeak,
}: {
  words: SentenceWord[];
  onRemoveWord: (id: string) => void;
  onClear: () => void;
  onSpeak: () => void;
}) {
  return (
    <section aria-labelledby="sentence-heading" className="glass-panel rounded-3xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="sentence-heading" className="flex items-center gap-2 text-sm font-semibold">
          <MessageSquareText className="h-4 w-4" aria-hidden="true" />
          Sentence builder
        </h2>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            onClick={onClear}
            disabled={words.length === 0}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Clear
          </Button>
          <Button
            size="sm"
            className="rounded-full"
            onClick={onSpeak}
            disabled={words.length === 0}
          >
            <Volume2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Speak sentence
          </Button>
        </div>
      </div>

      {words.length === 0 ? (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Sign gestures and they will appear here as words. Remove any you don&apos;t want, then
          speak the whole sentence aloud.
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2" role="list" aria-label="Composed sentence">
          {words.map((w) => (
            <span
              key={w.id}
              role="listitem"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background py-1.5 pl-3.5 pr-2 text-sm"
            >
              {w.text}
              <button
                type="button"
                onClick={() => onRemoveWord(w.id)}
                aria-label={`Remove word ${w.text}`}
                className="grid h-5 w-5 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
