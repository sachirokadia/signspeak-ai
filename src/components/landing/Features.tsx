import { Camera, Gauge, Globe2, Keyboard, Shield, Volume2 } from "lucide-react";
import { LandingCard } from "@/components/site/LandingCard";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

export const featureList = [
  {
    icon: Camera,
    title: "Real-time gesture detection",
    body: "Hand landmarks are tracked at up to 60fps, so signs are recognised the moment they are formed — no pauses, no capture button.",
  },
  {
    icon: Keyboard,
    title: "Gesture to text",
    body: "Recognised signs are assembled into fluent sentences with smart punctuation and context-aware phrase completion.",
  },
  {
    icon: Volume2,
    title: "Natural voice output",
    body: "Speak translated text aloud with adjustable voice, pitch and speed, or send it straight to a conversation partner.",
  },
  {
    icon: Gauge,
    title: "Visible confidence",
    body: "Every prediction shows a live confidence score, so users always know when to confirm rather than guess.",
  },
  {
    icon: Shield,
    title: "Private by design",
    body: "Inference runs locally in the browser. Video frames are processed and discarded — nothing is uploaded or stored.",
  },
  {
    icon: Globe2,
    title: "Multi-vocabulary support",
    body: "ASL, BSL and custom gesture packs, including personal signs you can record and train in a few seconds.",
  },
];

export function Features() {
  return (
    <section className="section-container section-padding" aria-labelledby="features-heading">
      <SectionHeading
        id="features-heading"
        eyebrow="Features"
        title="Built for conversations that can't wait"
        description="Everything needed to turn movement into meaning — precise, transparent and comfortable to use all day."
      />

      <ul className="section-gap grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featureList.map((feature, i) => (
          <Reveal key={feature.title} delay={i * 0.06} as="li">
            <LandingCard className="group h-full p-6">
              <span
                className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
                aria-hidden="true"
              >
                <feature.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-6 text-base font-semibold leading-6">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.body}</p>
            </LandingCard>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
