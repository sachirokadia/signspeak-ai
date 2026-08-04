"use client";

import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Sparkles, Volume2 } from "lucide-react";
import { MarketingButton } from "@/components/site/MarketingButton";

const chips = ["Hello", "Thank you", "Yes", "Water", "Help"];

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const motionProps = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
    : {};

  return (
    <section className="bg-soft relative overflow-hidden" aria-labelledby="hero-heading">
      <div className="grid-backdrop pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="section-container relative grid gap-12 pt-16 pb-20 md:gap-16 md:pt-20 md:pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pt-24">
        <div>
          <motion.div
            {...(prefersReducedMotion
              ? motionProps
              : {
                  initial: { opacity: 0, y: 16 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                })}
            className="text-eyebrow inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Real-time gesture intelligence, running on-device
          </motion.div>

          <motion.h1
            id="hero-heading"
            {...(prefersReducedMotion
              ? motionProps
              : {
                  initial: { opacity: 0, y: 16 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] },
                })}
            className="mt-6 text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl md:mt-8 lg:text-6xl"
          >
            Every gesture deserves <span className="text-gradient">a voice</span>.
          </motion.h1>

          <motion.p
            {...(prefersReducedMotion
              ? motionProps
              : {
                  initial: { opacity: 0, y: 16 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] },
                })}
            className="text-lead mt-6 max-w-xl text-muted-foreground text-pretty md:mt-8"
          >
            SignSpeak AI reads hand signs through your webcam and converts them into written words and
            natural speech — instantly, privately, and with confidence you can see.
          </motion.p>

          <motion.div
            {...(prefersReducedMotion
              ? motionProps
              : {
                  initial: { opacity: 0, y: 16 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] },
                })}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:mt-10"
          >
            <MarketingButton asChild marketingVariant="primary">
              <Link to="/dashboard" aria-label="Start translating sign language in the dashboard">
                Start translating
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </MarketingButton>
            <MarketingButton asChild marketingVariant="secondary">
              <Link to="/features" aria-label="Learn how SignSpeak AI works">
                See how it works
              </Link>
            </MarketingButton>
          </motion.div>

          <p className="mt-6 text-xs leading-4 text-muted-foreground md:mt-8">
            No sign-up required · Camera frames never leave your device
          </p>
        </div>

        <motion.div
          {...(prefersReducedMotion
            ? motionProps
            : {
                initial: { opacity: 0, y: 24, scale: 0.98 },
                animate: { opacity: 1, y: 0, scale: 1 },
                transition: { duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
              })}
          className="glass-panel rounded-3xl p-4 sm:p-6"
          aria-hidden="true"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-foreground/90">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,oklch(0.6_0.18_262/0.55),transparent_60%),radial-gradient(circle_at_75%_75%,oklch(0.55_0.22_293/0.5),transparent_60%)]" />
            {!prefersReducedMotion && (
              <motion.div
                className="absolute inset-x-10 inset-y-8 rounded-2xl border border-white/40"
                animate={{ opacity: [0.35, 0.9, 0.35], scale: [0.98, 1, 0.98] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Live camera
            </div>
            <div className="absolute right-4 bottom-4 left-4 rounded-xl bg-white/90 p-4 backdrop-blur">
              <p className="text-xs font-medium text-muted-foreground">Detected phrase</p>
              <p className="font-display mt-2 text-lg font-semibold leading-7">“Thank you for helping me.”</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted" role="presentation">
                  {!prefersReducedMotion ? (
                    <motion.div
                      className="bg-brand h-full rounded-full"
                      animate={{ width: ["55%", "96%", "72%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ) : (
                    <div className="bg-brand h-full w-[96%] rounded-full" />
                  )}
                </div>
                <span className="text-xs font-semibold text-primary">96%</span>
                <Volume2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip, i) => (
              <motion.span
                key={chip}
                {...(prefersReducedMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 8 },
                      animate: { opacity: 1, y: 0 },
                      transition: { delay: 0.6 + i * 0.08, duration: 0.4 },
                    })}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                {chip}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
