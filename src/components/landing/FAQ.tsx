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

export function FAQ() {
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-3xl px-5 py-24">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />
        <Reveal delay={0.1} className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q} className="border-border">
                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
