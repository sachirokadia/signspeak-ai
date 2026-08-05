"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/*
 * Reveal
 * Scroll-triggered entrance animation shared by every landing section.
 * Automatically disables motion when the OS "reduce motion" preference is set,
 * using Framer Motion's useReducedMotion hook so JS-driven animations are
 * respected in addition to the CSS media query fallback in styles.css.
 *
 * Timing: 500–550ms duration, cubic-bezier(0.22, 1, 0.36, 1) — matches the
 * motion system spec for section reveals.
 */

const fullVariants: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

// When reduced motion is preferred: fade only — no translation, no blur
const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={prefersReduced ? reducedVariants : fullVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: prefersReduced ? 0.2 : 0.55,
        delay: prefersReduced ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
