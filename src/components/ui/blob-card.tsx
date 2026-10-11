"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Violet blob card with a bright yellow under-blob peeking behind at a
 * slight tilt — the signature shape of the approved design language.
 * The under-blob is decorative (aria-hidden).
 */
export function BlobCard({
  children,
  className = "",
  tiltClassName = "-rotate-3",
}: {
  children: ReactNode;
  className?: string;
  /** Rotation/offset of the yellow under-blob. */
  tiltClassName?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden="true"
        className={cn("bg-yellow absolute inset-0 rounded-[28px] shadow-sticker", tiltClassName)}
      />
      <div className="bg-blob relative rounded-[28px] shadow-lift">{children}</div>
    </div>
  );
}
