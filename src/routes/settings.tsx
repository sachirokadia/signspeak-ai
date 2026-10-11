"use client";

import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StickerChip } from "@/components/ui/sticker-chip";
import { Sparkle } from "@/components/ui/doodles";
import { useSettings } from "@/lib/settings";
import { clearHistory } from "@/lib/historyStore";

const title = "Settings — SignSpeak AI";
const description =
  "Tune recognition sensitivity, gesture vocabulary, voice output, accessibility preferences and data retention.";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Settings,
});

function SettingsCard({
  heading,
  hint,
  children,
}: {
  heading: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-panel relative overflow-hidden rounded-[28px] p-7">
      <Sparkle className="absolute right-6 top-6 h-5 w-5 text-yellow" aria-hidden="true" />
      <h2 className="font-display text-lg font-bold">{heading}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}

function Row({
  label,
  description,
  control,
  htmlFor,
}: {
  label: string;
  description: string;
  control: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
      <div className="min-w-0">
        <Label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
        </Label>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

function Settings() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="min-h-dvh bg-soft">
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-14">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            <mark className="rounded-md bg-yellow px-1 text-yellow-foreground">Settings</mark>
          </h1>
          <StickerChip tone="violet" tilt="right">
            Auto-saved on this device
          </StickerChip>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Preferences apply instantly and are stored on this device.
        </p>

        <div className="mt-8 space-y-5">
          <Reveal>
            <SettingsCard heading="Recognition" hint="How the model interprets your hands.">
              <Row
                htmlFor="vocabulary"
                label="Gesture vocabulary"
                description="Base sign set used for matching."
                control={
                  <Select
                    value={settings.vocabulary}
                    onValueChange={(v) => updateSettings({ vocabulary: v })}
                  >
                    <SelectTrigger id="vocabulary" className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asl">ASL (English)</SelectItem>
                      <SelectItem value="bsl">BSL (British)</SelectItem>
                      <SelectItem value="custom">Custom pack</SelectItem>
                    </SelectContent>
                  </Select>
                }
              />
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sensitivity" className="text-sm font-medium">
                    Detection sensitivity
                  </Label>
                  <span className="text-xs text-muted-foreground">{settings.sensitivity}%</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Higher values react faster but may produce more false positives.
                </p>
                <Slider
                  id="sensitivity"
                  className="mt-4"
                  value={[settings.sensitivity]}
                  min={30}
                  max={100}
                  step={1}
                  onValueChange={([value]) => updateSettings({ sensitivity: value ?? 72 })}
                />
              </div>
            </SettingsCard>
          </Reveal>

          <Reveal delay={0.06}>
            <SettingsCard heading="Voice output" hint="How translated phrases are spoken.">
              <Row
                htmlFor="voice"
                label="Voice"
                description="Applies to all spoken output."
                control={
                  <Select
                    value={settings.voice}
                    onValueChange={(v) => updateSettings({ voice: v })}
                  >
                    <SelectTrigger id="voice" className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warm">Warm</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="bright">Bright</SelectItem>
                    </SelectContent>
                  </Select>
                }
              />
              <Row
                htmlFor="auto-speak"
                label="Speak automatically"
                description="Play each recognised phrase as soon as it's confident."
                control={
                  <Switch
                    id="auto-speak"
                    checked={settings.autoSpeak}
                    onCheckedChange={(v) => updateSettings({ autoSpeak: v })}
                  />
                }
              />
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="rate" className="text-sm font-medium">
                    Speech rate
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {settings.speechRate.toFixed(1)}×
                  </span>
                </div>
                <Slider
                  id="rate"
                  className="mt-4"
                  value={[settings.speechRate]}
                  min={0.5}
                  max={1.8}
                  step={0.1}
                  onValueChange={([value]) => updateSettings({ speechRate: value ?? 1 })}
                />
              </div>
            </SettingsCard>
          </Reveal>

          <Reveal delay={0.12}>
            <SettingsCard
              heading="Accessibility"
              hint="Make the interface fit how you read and move."
            >
              <Row
                htmlFor="large-text"
                label="Larger text"
                description="Increase base font size across the app."
                control={
                  <Switch
                    id="large-text"
                    checked={settings.largeText}
                    onCheckedChange={(v) => updateSettings({ largeText: v })}
                  />
                }
              />
              <Row
                htmlFor="reduce-motion"
                label="Reduce motion"
                description="Disable non-essential animations and transitions."
                control={
                  <Switch
                    id="reduce-motion"
                    checked={settings.reduceMotion}
                    onCheckedChange={(v) => updateSettings({ reduceMotion: v })}
                  />
                }
              />
            </SettingsCard>
          </Reveal>

          <Reveal delay={0.18}>
            <SettingsCard
              heading="Privacy & data"
              hint="Nothing is uploaded. You control what is kept."
            >
              <Row
                htmlFor="save-history"
                label="Save gesture history"
                description="Store translated phrases locally on this device."
                control={
                  <Switch
                    id="save-history"
                    checked={settings.saveHistory}
                    onCheckedChange={(v) => updateSettings({ saveHistory: v })}
                  />
                }
              />
              <Button
                variant="outline"
                className="h-11 rounded-full px-5"
                onClick={() => {
                  clearHistory();
                  toast("History cleared", {
                    description: "All stored phrases were removed.",
                  });
                }}
              >
                Clear stored history
              </Button>
            </SettingsCard>
          </Reveal>

          <p className="text-center text-sm text-muted-foreground" role="status">
            Preferences save automatically on this device.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
