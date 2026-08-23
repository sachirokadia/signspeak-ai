import { Quote } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

const testimonials = [
  {
    quote:
      "For the first time my son ordered his own coffee. He signed, the phone spoke, and the barista just answered him. That's it. That's the whole thing.",
    name: "Amara Osei",
    role: "Parent · Manchester",
  },
  {
    quote:
      "We keep a tablet with SignSpeak at triage. Waiting for an interpreter used to cost us forty minutes; now we start the intake immediately.",
    name: "Dr. Liam Reyes",
    role: "Emergency physician · Lisbon",
  },
  {
    quote:
      "The confidence score is what sold me. I can see when the model is unsure and correct it before it speaks something wrong.",
    name: "Sofia Lindqvist",
    role: "ASL interpreter · Stockholm",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <SectionHeading
        eyebrow="Testimonials"
        title="Voices from the people using it daily"
        description="Clinics, classrooms and kitchen tables — wherever a conversation needs to happen."
      />

      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {testimonials.map((item, i) => (
          <Reveal key={item.name} delay={i * 0.08}>
            <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <Quote className="h-6 w-6 text-primary/40" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 leading-relaxed text-pretty">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <span className="bg-brand grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-primary-foreground">
                  {item.name.charAt(0)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{item.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{item.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
