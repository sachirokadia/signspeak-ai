import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Features as FeatureGrid } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";

const title = "Features — SignSpeak AI";
const description =
  "Real-time gesture detection, gesture-to-text, natural voice output, live confidence scores and on-device privacy.";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: FeaturesPage,
});

function FeaturesPage() {
  return (
    <div className="min-h-dvh">
      <Navbar />
      <main>
        <section className="bg-soft border-b border-border">
          <div className="mx-auto max-w-3xl px-5 py-20 text-center">
            <Reveal>
              <h1 className="text-4xl font-semibold text-balance sm:text-5xl">
                A translation engine you can <span className="text-gradient">see working</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-muted-foreground text-pretty">
                Every part of SignSpeak AI is tuned for the moment between forming a sign and being
                heard.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-brand mt-8 h-12 rounded-full px-6 shadow-soft transition-transform hover:scale-[1.02]"
              >
                <Link to="/dashboard">Try it live</Link>
              </Button>
            </Reveal>
          </div>
        </section>
        <FeatureGrid />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
