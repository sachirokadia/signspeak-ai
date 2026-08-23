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
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps from gesture to conversation"
          description="No calibration sessions, no wearables, no waiting. Open the dashboard and start talking."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((item, i) => (
            <Reveal key={item.step} delay={i * 0.1}>
              <div className="relative h-full rounded-2xl border border-border bg-card p-7 shadow-soft transition-transform duration-300 hover:-translate-y-1">
                <span className="text-gradient font-display text-3xl font-semibold">
                  {item.step}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
