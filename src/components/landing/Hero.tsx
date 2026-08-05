"use client";

import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const chips = ["Hello", "Thank you", "Yes", "Water", "Help"];

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="bg-soft relative overflow-hidden">
      <div className="grid-backdrop pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        id="main-content"
        className="relative mx-auto grid max-w-6xl gap-14 px-5 pt-20 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-28"
      >
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Real-time gesture intelligence, running on-device
          </motion.div>

          {/* Heading — tighter line-height for large display sizes */}
          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-4xl leading-[1.08] font-semibold text-balance sm:text-5xl lg:text-6xl"
          >
            Every gesture deserves <span className="text-gradient">a voice</span>.
          </motion.h1>

          {/* Body copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty"
          >
            SignSpeak AI reads hand signs through your webcam and converts them into written words and
            natural speech — instantly, privately, and with confidence you can see.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            {/* Primary CTA */}
            <Button
              asChild
              size="lg"
              className="bg-brand h-12 rounded-full px-6 text-[15px] shadow-lift transition-[transform,box-shadow] duration-200 hover:scale-[1.02] hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Link to="/dashboard">
                Start translating
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>

            {/* Secondary CTA — glass-style hover reinforces hierarchy */}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-border bg-background/70 px-6 text-[15px] backdrop-blur transition-[background-color,box-shadow] duration-200 hover:bg-surface hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Link to="/features">See how it works</Link>
            </Button>
          </motion.div>

          {/* Trust line — delayed opacity-only fade, no layout shift */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mt-6 text-xs text-muted-foreground"
          >
            No sign-up required · Camera frames never leave your device
          </motion.p>
        </div>

        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel rounded-3xl p-4 sm:p-5"
        >
          {/* Mock camera viewport — ring softens the hard edge against the glass panel */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-foreground/90 ring-1 ring-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,oklch(0.6_0.18_262/0.55),transparent_60%),radial-gradient(circle_at_75%_75%,oklch(0.55_0.22_293/0.5),transparent_60%)]" />
            <motion.div
              className="absolute inset-x-10 inset-y-8 rounded-2xl border border-white/40"
              animate={{ opacity: [0.35, 0.9, 0.35], scale: [0.98, 1, 0.98] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
              <span>Live camera</span>
            </div>
            <div className="absolute right-4 bottom-4 left-4 rounded-xl bg-white/90 p-4 backdrop-blur">
              <p className="text-xs font-medium text-muted-foreground">Detected phrase</p>
              <p className="font-display mt-1 text-lg font-semibold">"Thank you for helping me."</p>
              <div className="mt-3 flex items-center gap-3">
                {/* Accessible progress bar */}
                <div
                  className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-valuenow={96}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Recognition confidence 96%"
                >
                  <motion.div
                    className="bg-brand h-full rounded-full"
                    animate={{ width: ["55%", "96%", "72%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <span className="text-xs font-semibold text-primary" aria-hidden="true">96%</span>
                <Volume2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Gesture chips — subtle whileHover capped at scale 1.03 per constraints */}
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip, i) => (
              <motion.span
                key={chip}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03, y: -1 }}
                transition={{
                  default: { delay: 0.6 + i * 0.08, duration: 0.4 },
                  scale: { duration: 0.15, ease: "easeOut" },
                  y: { duration: 0.15, ease: "easeOut" },
                }}
                className="cursor-default select-none rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground"
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
