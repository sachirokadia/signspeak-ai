import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Mission } from "@/components/landing/Mission";
import { Stats } from "@/components/landing/Stats";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";

const title = "SignSpeak AI — Turn hand gestures into text and speech";
const description =
  "SignSpeak AI reads sign language through your webcam and converts it into live text and natural speech, privately and on-device.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-dvh">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus-ring fixed top-4 left-4 z-[100] rounded-lg bg-background px-4 py-2 text-sm font-medium shadow-lift"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Features />
        <HowItWorks />
        <Mission />
        <Stats />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
