import { Link } from "@tanstack/react-router";
import { HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";

export function Mission() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-lift sm:p-14">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,oklch(0.55_0.22_293/0.22),transparent_70%)]" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,oklch(0.6_0.18_258/0.2),transparent_70%)]" />

          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                <HeartHandshake className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-6 text-3xl font-semibold text-balance sm:text-4xl">
                Accessibility isn't a feature. It's the whole product.
              </h2>
              <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground text-pretty">
                Over 70 million people worldwide use sign language as a first language, yet most everyday
                spaces — clinics, classrooms, counters — have no interpreter. SignSpeak AI exists to close
                that gap with technology that respects both privacy and dignity.
              </p>
              <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground text-pretty">
                We build with the Deaf and non-verbal community, not for them: every release is tested with
                screen readers, high-contrast modes, keyboard-only navigation and real signers.
              </p>
              <Button asChild size="lg" className="bg-brand mt-8 h-12 rounded-full px-6 shadow-soft transition-transform hover:scale-[1.02]">
                <Link to="/about">Read our mission</Link>
              </Button>
            </div>

            <ul className="grid gap-4">
              {[
                ["Co-designed", "Built alongside Deaf advocates and speech therapists."],
                ["Zero upload", "Frames processed locally and discarded immediately."],
                ["Always readable", "AA contrast, scalable type, full keyboard support."],
              ].map(([title, body]) => (
                <li key={title} className="glass-panel rounded-2xl p-5">
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
