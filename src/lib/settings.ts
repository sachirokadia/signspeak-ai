"use client";

import { useCallback, useEffect, useState } from "react";
import type { AppLang } from "@/lib/i18n/phrases";

export type Settings = {
  lang: AppLang;
  vocabulary: string;
  voice: string;
  sensitivity: number;
  speechRate: number;
  autoSpeak: boolean;
  saveHistory: boolean;
  largeText: boolean;
  reduceMotion: boolean;
};

const KEY = "signspeak-settings-v1";

const DEFAULTS: Settings = {
  lang: "en",
  vocabulary: "asl",
  voice: "warm",
  sensitivity: 72,
  speechRate: 1,
  autoSpeak: true,
  saveHistory: true,
  largeText: false,
  reduceMotion: false,
};

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      lang: parsed.lang === "hi" ? "hi" : "en",
      vocabulary: typeof parsed.vocabulary === "string" ? parsed.vocabulary : DEFAULTS.vocabulary,
      voice: typeof parsed.voice === "string" ? parsed.voice : DEFAULTS.voice,
      sensitivity:
        typeof parsed.sensitivity === "number" ? parsed.sensitivity : DEFAULTS.sensitivity,
      speechRate: typeof parsed.speechRate === "number" ? parsed.speechRate : DEFAULTS.speechRate,
      autoSpeak: typeof parsed.autoSpeak === "boolean" ? parsed.autoSpeak : DEFAULTS.autoSpeak,
      saveHistory:
        typeof parsed.saveHistory === "boolean" ? parsed.saveHistory : DEFAULTS.saveHistory,
      largeText: typeof parsed.largeText === "boolean" ? parsed.largeText : DEFAULTS.largeText,
      reduceMotion:
        typeof parsed.reduceMotion === "boolean" ? parsed.reduceMotion : DEFAULTS.reduceMotion,
    };
  } catch {
    return DEFAULTS;
  }
}

function persist(next: Settings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable — settings apply for this session only.
  }
}

/** Accessibility flags that take effect live on <html>. */
export function applyA11ySettings(settings: Pick<Settings, "largeText" | "reduceMotion">): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("large-text", settings.largeText);
  document.documentElement.classList.toggle("reduce-motion", settings.reduceMotion);
}

/** App settings, persisted locally and restored on load. */
export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    const stored = load();
    setSettings(stored);
    applyA11ySettings(stored);
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      persist(next);
      applyA11ySettings(next);
      return next;
    });
  }, []);

  const setLang = useCallback((lang: AppLang) => updateSettings({ lang }), [updateSettings]);

  return { settings, setLang, updateSettings };
}
