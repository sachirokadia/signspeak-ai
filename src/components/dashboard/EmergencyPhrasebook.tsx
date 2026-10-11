"use client";

import { Siren, Volume2 } from "lucide-react";
import { resolvePhrase, speechLangFor, type AppLang } from "@/lib/i18n/phrases";
import { speak } from "@/lib/speech";
import { cn } from "@/lib/utils";

const EMERGENCY_KEYS = ["help", "call", "water", "repeat"] as const;

/** Alternating sticker-tile fills: yellow, violet, yellow, violet. */
const TILE_TILTS = ["-rotate-2", "rotate-2", "rotate-1", "-rotate-1"];

/**
 * One-tap essential phrases for urgent moments — big targets, immediate
 * speech, no camera needed.
 */
export function EmergencyPhrasebook({ lang }: { lang: AppLang }) {
  const say = (key: string, fallback: string) => {
    speak(resolvePhrase(key, fallback, lang), {
      lang: speechLangFor(lang),
      rate: 0.95,
    });
  };

  return (
    <section
      aria-labelledby="emergency-heading"
      className="glass-panel rounded-3xl border-destructive/20 p-5"
    >
      <h2 id="emergency-heading" className="flex items-center gap-2 text-sm font-semibold">
        <Siren className="h-4 w-4 text-destructive" aria-hidden="true" />
        Emergency phrases
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {EMERGENCY_KEYS.map((key, i) => {
          const text = resolvePhrase(key, key, lang);
          const fill =
            i % 2 === 0 ? "bg-yellow text-yellow-foreground" : "bg-primary text-primary-foreground";
          const tilt = TILE_TILTS[i % TILE_TILTS.length] ?? "";
          return (
            <button
              key={key}
              type="button"
              onClick={() => say(key, key)}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2.5 text-sm font-bold shadow-sticker transition-transform duration-150 hover:scale-[1.04] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                fill,
                tilt,
              )}
            >
              <Volume2 className="h-4 w-4 opacity-70" aria-hidden="true" />
              {text}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        Spoken immediately in the selected language.
      </p>
    </section>
  );
}
