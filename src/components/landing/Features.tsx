import { Camera, Gauge, Globe2, Keyboard, Shield, Volume2 } from "lucide-react";
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
    <section className="mx-auto max-w-6xl px-5 py-24">
      <SectionHeading
        eyebrow="Features"
        title="Built for conversations that can't wait"
        description="Everything needed to turn movement into meaning — precise, transparent and comfortable to use all day."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featureList.map((feature, i) => (
          <Reveal key={feature.title} delay={i * 0.06}>
            <article className="group h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-base font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
