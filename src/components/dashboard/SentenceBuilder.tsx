"use client";

import { MessageSquareText, Trash2, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaPill } from "@/components/ui/cta-pill";
import { StickerChip } from "@/components/ui/sticker-chip";
import { Sparkle } from "@/components/ui/doodles";

export type SentenceWord = {
  id: string;
  text: string;
};

const WORD_TONES = ["yellow", "violet", "ghost"] as const;
const WORD_TILTS = ["left", "right", "none"] as const;

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
          <Sparkle className="h-3.5 w-3.5 text-yellow" />
        </h2>
        <div className="flex flex-wrap items-center gap-2">
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
          <CtaPill onClick={onSpeak} disabled={words.length === 0} className="h-9 px-4 text-[13px]">
            <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
            Speak sentence
          </CtaPill>
        </div>
      </div>

      {words.length === 0 ? (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Sign gestures and they will appear here as words. Remove any you don&apos;t want, then
          speak the whole sentence aloud.
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2" role="list" aria-label="Composed sentence">
          {words.map((w, i) => (
            <span key={w.id} role="listitem">
              <StickerChip
                tone={WORD_TONES[i % WORD_TONES.length] ?? "yellow"}
                tilt={WORD_TILTS[i % WORD_TILTS.length] ?? "none"}
                className="py-1.5 pr-1.5 pl-3.5 text-sm"
              >
                {w.text}
                <button
                  type="button"
                  onClick={() => onRemoveWord(w.id)}
                  aria-label={`Remove word ${w.text}`}
                  className="grid h-5 w-5 place-items-center rounded-full transition-colors hover:bg-black/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </StickerChip>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
