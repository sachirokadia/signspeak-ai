"use client";

import type { ReactNode } from "react";
import { ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const ctaPillClasses =
  "bg-brand text-primary-foreground inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-bold shadow-lift transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

/**
 * Gradient pill CTA with >>> chevrons — the primary action shape of the
 * approved design language ("Get Started >>>").
 */
export function CtaPill({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(ctaPillClasses, className)}
    >
      <span className="truncate">{children}</span>
      <ChevronsRight className="h-5 w-5 shrink-0" aria-hidden="true" />
    </button>
  );
}
