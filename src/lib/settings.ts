"use client";

import { useCallback, useEffect, useState } from "react";
import type { AppLang } from "@/lib/i18n/phrases";

export type Settings = {
  lang: AppLang;
};

const KEY = "signspeak-settings-v1";
const DEFAULTS: Settings = { lang: "en" };

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      lang: parsed.lang === "hi" ? "hi" : "en",
    };
  } catch {
    return DEFAULTS;
  }
}

/** App settings (currently: interface/spoken language), persisted locally. */
export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    setSettings(load());
  }, []);

  const setLang = useCallback((lang: AppLang) => {
    setSettings((prev) => {
      const next = { ...prev, lang };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // Storage unavailable — settings simply don't persist.
      }
      return next;
    });
  }, []);

  return { settings, setLang };
}
