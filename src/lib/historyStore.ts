"use client";

import type { HistoryEntry } from "@/lib/gestures";

const KEY = "signspeak-history-v1";
const MAX_ENTRIES = 200;

type StoredEntry = Omit<HistoryEntry, "at"> & { at: string };

/** Persist gesture history locally so analytics survive reloads. */
export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredEntry[];
    return parsed.map((e) => ({ ...e, at: new Date(e.at) }));
  } catch {
    return [];
  }
}

export function saveHistory(entries: HistoryEntry[]): void {
  try {
    const stored: StoredEntry[] = entries.slice(0, MAX_ENTRIES).map((e) => ({
      ...e,
      at: e.at instanceof Date ? e.at.toISOString() : new Date(e.at).toISOString(),
    }));
    localStorage.setItem(KEY, JSON.stringify(stored));
  } catch {
    // Storage unavailable (private mode etc.) — history stays in memory.
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
