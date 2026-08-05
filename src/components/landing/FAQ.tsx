"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

const faqs = [
  {
    q: "Does my video get uploaded anywhere?",
    a: "No. Gesture recognition runs entirely in your browser. Frames are analysed and immediately discarded — only the resulting text is kept, and only if you enable history.",
  },
  {
    q: "Which sign languages are supported?",
    a: "The core model covers 250+ ASL and BSL signs, including the full fingerspelling alphabet. You can also record custom gestures for personal signs, names and frequently used phrases.",
  },
  {
    q: "What hardware do I need?",
    a: "Any device with a webcam and a modern browser. A standard laptop camera or a mid-range phone is enough; no depth sensor, glove or external hardware is required.",
  },
  {
    q: "How accurate is it in low light?",
    a: "Accuracy stays above 90% in typical indoor lighting. The dashboard surfaces a live confidence score and warns you when lighting or framing is degrading the prediction.",
  },
  {
    q: "Can it work offline?",
    a: "Yes. Once the model is cached, translation and speech output continue to work without a network connection.",
  },
  {
    q: "Is it accessible to screen reader users?",
    a: "Every control is keyboard reachable and labelled, translated text is announced through a live region, and the interface meets WCAG 2.2 AA contrast requirements.",
  },
];

/*
 * FaqAnswer
 * Wraps the accordion answer text in a Framer Motion fade so the content
 * materialises softly rather than being abruptly revealed by the height transition.
 * The animation is suppressed entirely when prefers-reduced-motion is set.
 * Duration: 200ms — modal/dialog tier per motion spec (content reveal inside a container).
 */
function FaqAnswer({ text }: { text: string }) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReduced ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
    </motion.div>
  );
}

export function FAQ() {
  return (
    <section aria-label="Frequently asked questions" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-3xl px-5 py-24">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />

        {/*
         * Each AccordionItem gets its own Reveal so questions cascade in
         * individually at 40ms intervals — fast enough to feel unified,
         * visible enough to guide the eye down the list.
         * Stagger: i * 0.04 — 6 items × 40ms = 240ms total spread.
         */}
        <Accordion type="single" collapsible className="mt-10 w-full">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 0.04}>
              <AccordionItem
                value={faq.q}
                /*
                 * first:border-t-0 removes the top border on the first item so
                 * it doesn't double-up with the section heading's bottom space.
                 */
                className="border-border first:border-t-0"
              >
                <AccordionTrigger
                  /*
                   * data-[state=open]:text-primary colours the active question
                   * in the brand colour so users know which answer they're reading.
                   * hover:no-underline overrides the Shadcn default underline.
                   * Transition: 150ms — hover tier per motion spec.
                   */
                  className="text-left text-base font-semibold
                             transition-colors duration-150
                             hover:no-underline
                             data-[state=open]:text-primary"
                >
                  {faq.q}
                </AccordionTrigger>

                {/* Shadcn AccordionContent handles the height animation via CSS vars */}
                <AccordionContent>
                  <FaqAnswer text={faq.a} />
                </AccordionContent>
              </AccordionItem>
            </Reveal>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
