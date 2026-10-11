"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StickerTone = "yellow" | "violet" | "ghost";
type StickerTilt = "left" | "right" | "none";

/**
 * Tilted sticker chip from the approved design language.
 * yellow = black-on-yellow (#Date style), violet = white-on-violet
 * (100% Match style), ghost = subtle outline.
 */
export function StickerChip({
  children,
  tone = "yellow",
  tilt = "left",
  className = "",
}: {
  children: ReactNode;
  tone?: StickerTone;
  tilt?: StickerTilt;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold tracking-wide shadow-sticker",
        tilt === "left" && "-rotate-3",
        tilt === "right" && "rotate-2",
        tone === "yellow" && "bg-yellow text-yellow-foreground",
        tone === "violet" && "bg-primary text-primary-foreground",
        tone === "ghost" &&
          "border border-border bg-card/70 text-muted-foreground shadow-none backdrop-blur",
        className,
      )}
    >
      {children}
    </span>
  );
}
