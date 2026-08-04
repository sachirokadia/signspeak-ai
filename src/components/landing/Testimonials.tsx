import { Quote } from "lucide-react";
import { LandingCard } from "@/components/site/LandingCard";
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
    <section className="section-container section-padding" aria-labelledby="testimonials-heading">
      <SectionHeading
        id="testimonials-heading"
        eyebrow="Testimonials"
        title="Voices from the people using it daily"
        description="Clinics, classrooms and kitchen tables — wherever a conversation needs to happen."
      />

      <ul className="section-gap grid list-none gap-6 lg:grid-cols-3">
        {testimonials.map((item, i) => (
          <Reveal key={item.name} delay={i * 0.08} as="li">
            <LandingCard className="flex h-full flex-col p-8">
              <figure className="flex h-full flex-col">
                <Quote className="h-6 w-6 text-primary/50" aria-hidden="true" />
                <blockquote className="mt-4 flex-1 text-base leading-7 text-pretty">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4 border-t border-border pt-6">
                  <span
                    className="bg-brand grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-primary-foreground"
                    aria-hidden="true"
                  >
                    {item.name.charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <cite className="block truncate text-sm font-semibold not-italic">{item.name}</cite>
                    <span className="block truncate text-xs leading-4 text-muted-foreground">{item.role}</span>
                  </span>
                </figcaption>
              </figure>
            </LandingCard>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
