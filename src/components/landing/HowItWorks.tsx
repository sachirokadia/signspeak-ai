import { LandingCard } from "@/components/site/LandingCard";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

const steps = [
  {
    step: "01",
    title: "Enable the camera",
    body: "Grant one-time camera access. The feed stays on your device and can be paused or mirrored at any moment.",
  },
  {
    step: "02",
    title: "Sign naturally",
    body: "The model tracks 21 hand landmarks per frame and matches the motion against your active gesture vocabulary.",
  },
  {
    step: "03",
    title: "Read and speak",
    body: "Words appear instantly with a confidence score, then play aloud in the voice you chose — or copy them anywhere.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-surface" aria-labelledby="how-it-works-heading">
      <div className="section-container section-padding">
        <SectionHeading
          id="how-it-works-heading"
          eyebrow="How it works"
          title="Three steps from gesture to conversation"
          description="No calibration sessions, no wearables, no waiting. Open the dashboard and start talking."
        />

        <ol className="section-gap grid list-none gap-6 md:grid-cols-3">
          {steps.map((item, i) => (
            <Reveal key={item.step} delay={i * 0.1} as="li">
              <LandingCard className="relative h-full p-8">
                <span className="text-gradient font-display text-3xl font-semibold leading-8" aria-hidden="true">
                  {item.step}
                </span>
                <h3 className="mt-4 text-lg font-semibold leading-7">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </LandingCard>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
