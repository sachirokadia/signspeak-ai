"use client";

import { Siren, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resolvePhrase, speechLangFor, type AppLang } from "@/lib/i18n/phrases";
import { speak } from "@/lib/speech";

const EMERGENCY_KEYS = ["help", "call", "water", "repeat"] as const;

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
      <div className="mt-3 grid grid-cols-2 gap-2">
        {EMERGENCY_KEYS.map((key) => {
          const text = resolvePhrase(key, key, lang);
          return (
            <Button
              key={key}
              variant="outline"
              className="h-auto min-h-14 flex-col gap-1 rounded-2xl px-3 py-2.5 text-sm font-medium"
              onClick={() => say(key, key)}
            >
              <Volume2 className="h-4 w-4 opacity-70" aria-hidden="true" />
              {text}
            </Button>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Spoken immediately in the selected language.
      </p>
    </section>
  );
}
