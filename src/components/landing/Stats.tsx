"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/site/Reveal";

const stats = [
  {
    value: 98.4,
    suffix: "%",
    label: "Recognition accuracy",
    detail: "On the core 250-sign vocabulary",
  },
  { value: 42, suffix: "ms", label: "Median latency", detail: "Gesture to rendered text" },
  { value: 250, suffix: "+", label: "Supported gestures", detail: "ASL, BSL and custom packs" },
  {
    value: 12,
    suffix: "k",
    label: "Daily conversations",
    detail: "Translated across 34 countries",
  },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [inView, value]);

  const formatted = Number.isInteger(value) ? Math.round(display) : display.toFixed(1);

  return (
    <span ref={ref} className="text-gradient font-display text-4xl font-semibold sm:text-5xl">
      {formatted}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-20 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <Counter value={stat.value} suffix={stat.suffix} />
              <p className="mt-3 text-sm font-semibold">{stat.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.detail}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
