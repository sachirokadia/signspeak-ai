"use client";

import type { HistoryEntry } from "@/lib/gestures";

function csvCell(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Download gesture history as CSV — for therapists, teachers, carers. */
export function exportHistoryCsv(entries: HistoryEntry[]): void {
  const header = ["timestamp", "gesture", "phrase", "confidence"];
  const rows = entries.map((e) =>
    [
      csvCell(e.at instanceof Date ? e.at.toISOString() : String(e.at)),
      csvCell(e.gesture),
      csvCell(e.phrase),
      csvCell(Math.round(e.confidence * 100) / 100),
    ].join(","),
  );
  const csv = [header.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `signspeak-history-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
}
