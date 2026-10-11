"use client";

import { cn } from "@/lib/utils";

/**
 * Tiny hand-drawn doodle SVGs (sparkles, squiggles, hearts, arrows) that
 * give the approved design its hand-crafted feel. All use currentColor so
 * callers set the tone with text-* classes. Decorative — always aria-hidden.
 */

function base(className?: string) {
  return cn("pointer-events-none select-none", className);
}

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} aria-hidden="true">
      <path
        d="M12 3c.7 4.8 2.6 7.6 7.5 8.4-4.9.9-6.8 3.7-7.5 8.6-.7-4.9-2.6-7.7-7.5-8.6 4.9-.8 6.8-3.6 7.5-8.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 14"
      fill="none"
      className={base(className)}
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M2 8c6-7 10 5 16-2s10 5 16-2 10 4 14 0 6-3 10-1" />
    </svg>
  );
}

export function HeartDoodle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={base(className)}
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20.5c-5.5-3.6-8.5-7-8.5-10.6 0-2.5 1.9-4.4 4.2-4.4 1.7 0 3.2 1 4.3 2.6 1.1-1.6 2.6-2.6 4.3-2.6 2.3 0 4.2 1.9 4.2 4.4 0 3.6-3 7-8.5 10.6Z" />
    </svg>
  );
}

export function ArrowDoodle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 24"
      fill="none"
      className={base(className)}
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 18c10-1 20-6 28-12" />
      <path d="M24 4.5 31.5 6 30 13.5" />
    </svg>
  );
}

export function ZigZag({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 16"
      fill="none"
      className={base(className)}
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12 10 4l8 8 8-8 8 8" />
    </svg>
  );
}
