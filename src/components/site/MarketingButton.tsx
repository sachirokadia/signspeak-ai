import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MarketingButtonProps = ButtonProps & {
  marketingVariant?: "primary" | "secondary";
  loading?: boolean;
};

const variantStyles = {
  primary: cn(
    "bg-brand h-12 rounded-full px-6 text-[15px] font-medium shadow-lift",
    "transition-[transform,box-shadow,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
    "hover:shadow-lift hover:brightness-[1.03]",
    "active:scale-[0.98]",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-60",
    "motion-safe:hover:scale-[1.02]",
  ),
  secondary: cn(
    "h-12 rounded-full border-border bg-background/70 px-6 text-[15px] font-medium backdrop-blur",
    "transition-[background-color,border-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
    "hover:border-primary/25 hover:bg-surface",
    "active:scale-[0.98]",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-60",
  ),
} as const;

export function MarketingButton({
  marketingVariant = "primary",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: MarketingButtonProps) {
  return (
    <Button
      variant={marketingVariant === "secondary" ? "outline" : "default"}
      size="lg"
      className={cn(variantStyles[marketingVariant], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span className="sr-only">Loading</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}
