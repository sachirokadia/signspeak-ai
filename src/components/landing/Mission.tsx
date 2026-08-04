import { Link } from "@tanstack/react-router";
import { HeartHandshake } from "lucide-react";
import { MarketingButton } from "@/components/site/MarketingButton";
import { Reveal } from "@/components/site/Reveal";

export function Mission() {
  return (
    <section className="section-container section-padding" aria-labelledby="mission-heading">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-lift sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,oklch(0.55_0.22_293/0.22),transparent_70%)]" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,oklch(0.6_0.18_258/0.2),transparent_70%)]" aria-hidden="true" />

          <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
            <div>
              <span
                className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground"
                aria-hidden="true"
              >
                <HeartHandshake className="h-5 w-5" />
              </span>
              <h2
                id="mission-heading"
                className="mt-6 text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:mt-8"
              >
                Accessibility isn't a feature. It's the whole product.
              </h2>
              <p className="mt-6 max-w-xl leading-7 text-muted-foreground text-pretty">
                Over 70 million people worldwide use sign language as a first language, yet most everyday
                spaces — clinics, classrooms, counters — have no interpreter. SignSpeak AI exists to close
                that gap with technology that respects both privacy and dignity.
              </p>
              <p className="mt-4 max-w-xl leading-7 text-muted-foreground text-pretty">
                We build with the Deaf and non-verbal community, not for them: every release is tested with
                screen readers, high-contrast modes, keyboard-only navigation and real signers.
              </p>
              <MarketingButton asChild marketingVariant="primary" className="mt-8 md:mt-10">
                <Link to="/about" aria-label="Read our mission and accessibility commitment">
                  Read our mission
                </Link>
              </MarketingButton>
            </div>

            <ul className="grid list-none gap-4" aria-label="Mission highlights">
              {[
                ["Co-designed", "Built alongside Deaf advocates and speech therapists."],
                ["Zero upload", "Frames processed locally and discarded immediately."],
                ["Always readable", "AA contrast, scalable type, full keyboard support."],
              ].map(([title, body]) => (
                <li key={title} className="glass-panel rounded-2xl p-6">
                  <p className="text-sm font-semibold leading-5">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
