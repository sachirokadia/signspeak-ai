import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";

const title = "About — SignSpeak AI";
const description =
  "Why we built SignSpeak AI: closing the interpreter gap with private, on-device gesture recognition designed with the Deaf community.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: About,
});

const values = [
  ["Dignity first", "A translation tool should never make someone feel like a subject of study. Every interaction is designed to be quiet, quick and ordinary."],
  ["Nothing leaves the device", "Camera frames are processed locally and discarded. History is stored on the device and can be wiped in one tap."],
  ["Transparent by default", "Confidence scores, model versions and detected gestures are always visible — no black box speaking on your behalf."],
  ["Built with, not for", "Deaf advocates, interpreters and speech therapists review every release before it ships."],
];

export function About() {
  return (
    <div className="min-h-dvh">
      <Navbar />
      <main>
        <section className="bg-soft border-b border-border">
          <div className="mx-auto max-w-3xl px-5 py-20 text-center">
            <Reveal>
              <h1 className="text-4xl font-semibold text-balance sm:text-5xl">
                We're building the shortest path between <span className="text-gradient">a gesture and being understood</span>.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-muted-foreground text-pretty">
                SignSpeak AI began in a hospital waiting room, where a 40-minute wait for an interpreter meant a
                patient couldn't describe their own pain. We thought the phone already in their pocket should be
                enough. Three years later, it is.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-24">
          <SectionHeading eyebrow="Our values" title="Four principles we don't trade away" />
          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {values.map(([heading, body], i) => (
              <Reveal key={heading} delay={i * 0.07}>
                <div className="h-full rounded-2xl border border-border bg-card p-7 shadow-soft transition-transform duration-300 hover:-translate-y-1">
                  <h2 className="text-lg font-semibold">{heading}</h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-3xl px-5 py-20 text-center">
            <Reveal>
              <h2 className="text-3xl font-semibold text-balance">Try it in your own hands</h2>
              <p className="mt-3 text-muted-foreground">
                The dashboard works right now, in this browser, without an account.
              </p>
              <Button asChild size="lg" className="bg-brand mt-8 h-12 rounded-full px-6 shadow-soft transition-transform hover:scale-[1.02]">
                <Link to="/dashboard">Open the dashboard</Link>
              </Button>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
