"use client";

import { motion, AnimatePresence } from "motion/react";
import { Copy, Pause, Play, Trash2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { HistoryEntry } from "@/lib/gestures";
import { formatTime } from "@/lib/gestures";

export function TranslationPanel({
  transcript,
  current,
  autoSpeak,
  onAutoSpeakChange,
  rate,
  onRateChange,
  onClear,
  active,
  onToggle,
}: {
  transcript: string;
  current: HistoryEntry | null;
  autoSpeak: boolean;
  onAutoSpeakChange: (value: boolean) => void;
  rate: number;
  onRateChange: (value: number) => void;
  onClear: () => void;
  active: boolean;
  onToggle: (next: boolean) => void;
}) {
  const confidence = current ? Math.round(current.confidence * 100) : 0;

  function speak() {
    if (!transcript.trim()) {
      toast("Nothing to speak yet", { description: "Start signing to build a sentence." });
      return;
    }
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast("Speech output unavailable", { description: "This browser doesn't support speech synthesis." });
      return;
    }
    const utterance = new SpeechSynthesisUtterance(transcript);
    utterance.rate = rate;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="glass-panel rounded-3xl p-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">Live translation</h2>
            <p className="truncate text-xs text-muted-foreground">Updates as each sign is recognised</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 rounded-full"
            onClick={() => onToggle(!active)}
          >
            {active ? <Pause className="mr-1.5 h-3.5 w-3.5" /> : <Play className="mr-1.5 h-3.5 w-3.5" />}
            {active ? "Pause" : "Resume"}
          </Button>
        </div>

        <div
          aria-live="polite"
          className="mt-5 min-h-32 rounded-2xl border border-border bg-background/70 p-5"
        >
          <p className="font-display text-xl leading-relaxed font-medium text-pretty">
            {transcript || <span className="text-muted-foreground">Waiting for your first gesture…</span>}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={speak} className="bg-brand h-11 rounded-full px-5">
            <Volume2 className="mr-1.5 h-4 w-4" />
            Speak
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-full px-5"
            onClick={() => {
              navigator.clipboard?.writeText(transcript);
              toast("Copied to clipboard");
            }}
          >
            <Copy className="mr-1.5 h-4 w-4" />
            Copy
          </Button>
          <Button variant="ghost" className="h-11 rounded-full px-5" onClick={onClear}>
            <Trash2 className="mr-1.5 h-4 w-4" />
            Clear
          </Button>
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2">
        <section className="glass-panel rounded-3xl p-6">
          <h2 className="text-sm font-semibold">Detected gesture</h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={current?.id ?? "none"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="font-display mt-3 text-2xl font-semibold"
            >
              {current?.gesture ?? "—"}
            </motion.p>
          </AnimatePresence>
          <p className="mt-2 text-xs text-muted-foreground">
            {current ? `Recognised at ${formatTime(current.at)}` : "No gesture in frame"}
          </p>
        </section>

        <section className="glass-panel rounded-3xl p-6">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold">Confidence</h2>
            <span className="text-gradient font-display text-2xl font-semibold">{confidence}%</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="bg-brand h-full rounded-full"
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {confidence >= 90
              ? "High certainty — safe to speak automatically."
              : confidence > 0
                ? "Moderate certainty — confirm before speaking."
                : "Waiting for a prediction."}
          </p>
        </section>
      </div>

      <section className="glass-panel rounded-3xl p-6">
        <h2 className="text-sm font-semibold">Voice output</h2>
        <div className="mt-5 flex items-center justify-between gap-4">
          <Label htmlFor="auto-speak" className="text-sm font-medium">
            Speak each phrase automatically
          </Label>
          <Switch id="auto-speak" checked={autoSpeak} onCheckedChange={onAutoSpeakChange} />
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="rate" className="text-sm font-medium">
              Speech rate
            </Label>
            <span className="text-xs text-muted-foreground">{rate.toFixed(1)}×</span>
          </div>
          <Slider
            id="rate"
            className="mt-3"
            value={[rate]}
            min={0.5}
            max={1.8}
            step={0.1}
            onValueChange={([value]) => onRateChange(value ?? 1)}
          />
        </div>
      </section>
    </div>
  );
}
