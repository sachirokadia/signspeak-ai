import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/history", label: "History" },
  { to: "/features", label: "Features" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/settings", label: "Settings" },
] as const;

/*
 * SCROLL THRESHOLD
 * Navbar transitions from transparent → frosted glass after 20px of scroll.
 * Threshold is intentionally low so the transition feels immediate when the
 * user begins scrolling but the navbar is still fully transparent at the top.
 */
const SCROLL_THRESHOLD = 20;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /*
   * rAF-throttled scroll detection.
   * A raw "scroll" listener fires ~60+ times/sec; wrapping with
   * requestAnimationFrame collapses those into at most one read per paint
   * frame, eliminating unnecessary React re-renders while the user scrolls.
   */
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafId.current !== null) return; // already scheduled, skip
      rafId.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > SCROLL_THRESHOLD);
        rafId.current = null;
      });
    };

    // Sync state immediately on mount in case the page loads mid-scroll
    setScrolled(window.scrollY > SCROLL_THRESHOLD);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <header
      className={[
        /*
         * Transition scoped to the three properties that actually change.
         * backdrop-blur is applied only when scrolled to avoid the extra
         * compositing layer cost while the navbar is fully transparent.
         */
        "sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/80 shadow-soft backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      {/* Skip-to-content — visually hidden until focused, required for WCAG 2.1 SC 2.4.1 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lift focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5"
      >
        <Logo />

        {/* Desktop links */}
        <div className="ml-auto hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground
                         transition-colors duration-150
                         hover:bg-surface hover:text-foreground
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              activeProps={{ className: "bg-surface text-foreground" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          {/* Primary CTA — 180ms button timing per motion spec */}
          <Button
            asChild
            size="sm"
            className="bg-brand rounded-full px-4 shadow-soft
                       transition-[transform,box-shadow] duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                       hover:scale-[1.03] hover:shadow-lift
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Link to="/dashboard">Launch app</Link>
          </Button>

          {/* Mobile menu trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
                aria-expanded={open}
                aria-controls="mobile-nav"
                className="min-h-11 min-w-11 focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72" id="mobile-nav">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="mt-8 flex flex-col gap-0.5 px-4">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    /* py-3.5 ensures every tap target is at least 44px tall */
                    className="rounded-lg px-3 py-3.5 text-sm font-medium text-muted-foreground
                               transition-colors duration-150
                               hover:bg-surface hover:text-foreground
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    activeProps={{ className: "bg-surface text-foreground" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
