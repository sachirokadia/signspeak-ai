import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function LandingCard({
  children,
  className,
  interactive = true,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card shadow-soft",
        interactive && "card-interactive",
        className,
      )}
    >
      {children}
    </div>
  );
}
