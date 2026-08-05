"use client";

import { Volume2, VolumeX } from "lucide-react";
import { motion } from "motion/react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

/**
 * VoiceCard
 * Voice output settings panel.
 * Responsibilities:
 *   - Auto-speak toggle: automatically speak each recognised phrase
 *   - Speech rate slider (0.5× — 1.8×)
 *   - Visual voice-status indicator (active / muted)
 *
 * Props
 *   autoSpeak        — whether auto-speak is on
 *   onAutoSpeakChange
 *   rate             — speech rate multiplier
 *   onRateChange
 */
export function VoiceCard({
  autoSpeak,
  onAutoSpeakChange,
  rate,
  onRateChange,
}: {
  autoSpeak: boolean;
  onAutoSpeakChange: (value: boolean) => void;
  rate: number;
  onRateChange: (value: number) => void;
}) {
  return (
    <section
      aria-label="Voice output settings"
      className="glass-panel flex flex-col rounded-3xl p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground"
          aria-hidden="true"
        >
          {autoSpeak ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </span>
        <h2 className="text-sm font-semibold">Voice output</h2>

        {/* Status pill */}
        <motion.span
          key={autoSpeak ? "on" : "off"}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.18 }}
          className={[
            "ml-auto rounded-full px-2.5 py-1 text-xs font-semibold",
            autoSpeak
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground",
          ].join(" ")}
          aria-live="polite"
        >
          {autoSpeak ? "Auto-speak on" : "Manual"}
        </motion.span>
      </div>

      <div className="mt-6 space-y-6">
        {/* Auto-speak toggle */}
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <Label
              htmlFor="auto-speak"
              className="text-sm font-medium cursor-pointer"
            >
              Speak each phrase automatically
            </Label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Plays audio as soon as confidence exceeds 90%.
            </p>
          </div>
          <Switch
            id="auto-speak"
            checked={autoSpeak}
            onCheckedChange={onAutoSpeakChange}
            aria-label="Toggle automatic speech"
            className="shrink-0"
          />
        </div>

        {/* Rate slider */}
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="speech-rate" className="text-sm font-medium">
              Speech rate
            </Label>
            <span
              className="tabular-nums text-xs text-muted-foreground"
              aria-live="polite"
              aria-label={`Speech rate ${rate.toFixed(1)} times`}
            >
              {rate.toFixed(1)}×
            </span>
          </div>
          <Slider
            id="speech-rate"
            className="mt-3"
            value={[rate]}
            min={0.5}
            max={1.8}
            step={0.1}
            onValueChange={([value]) => onRateChange(value ?? 1)}
            aria-label="Speech rate"
            aria-valuemin={0.5}
            aria-valuemax={1.8}
            aria-valuenow={rate}
            aria-valuetext={`${rate.toFixed(1)} times`}
          />
          <div className="mt-1.5 flex justify-between text-[0.625rem] text-muted-foreground/60">
            <span>0.5× slower</span>
            <span>1.8× faster</span>
          </div>
        </div>
      </div>
    </section>
  );
}
