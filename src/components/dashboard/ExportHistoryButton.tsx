"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportHistoryCsv } from "@/lib/export";
import type { HistoryEntry } from "@/lib/gestures";

/** Download the gesture history as CSV — for therapists and teachers. */
export function ExportHistoryButton({ entries }: { entries: HistoryEntry[] }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-full"
      disabled={entries.length === 0}
      onClick={() => exportHistoryCsv(entries)}
    >
      <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
      Export CSV
    </Button>
  );
}
