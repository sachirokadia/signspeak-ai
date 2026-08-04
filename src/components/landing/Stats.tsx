"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { LandingCard } from "@/components/site/LandingCard";
import { Reveal } from "@/components/site/Reveal";

const stats = [
  { value: 98.4, suffix: "%", label: "Recognition accuracy", detail: "On the core 250-sign vocabulary" },
  { value: 42, suffix: "ms", label: "Median latency", detail: "Gesture to rendered text" },
  { value: 250, suffix: "+", label: "Supported gestures", detail: "ASL, BSL and custom packs" },
  { value: 12, suffix: "k", label: "Daily conversations", detail: "Translated across 34 countries" },
];

function Counter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-64px" });
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(prefersReducedMotion ? value : 0);
  const [isAnimating, setIsAnimating] = useState(!prefersReducedMotion);

  useEffect(() => {
    if (!inView) return;

    if (prefersReducedMotion) {
      setDisplay(value);
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(latest),
      onComplete: () => setIsAnimating(false),
    });
    return () => controls.stop();
  }, [inView, value, prefersReducedMotion]);

  const formatted = Number.isInteger(value) ? Math.round(display) : display.toFixed(1);

  return (
    <span
      ref={ref}
      className="text-gradient font-display text-4xl font-semibold leading-none sm:text-5xl"
      aria-live="polite"
      aria-busy={isAnimating}
      aria-label={`${formatted}${suffix} ${label}`}
    >
      {formatted}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="border-y border-border bg-surface" aria-label="Product statistics">
      <div className="section-container grid gap-6 py-16 sm:grid-cols-2 sm:py-20 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <LandingCard interactive={false} className="p-6">
              <Counter value={stat.value} suffix={stat.suffix} label={stat.label} />
              <p className="mt-4 text-sm font-semibold leading-5">{stat.label}</p>
              <p className="mt-2 text-xs leading-4 text-muted-foreground">{stat.detail}</p>
            </LandingCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
