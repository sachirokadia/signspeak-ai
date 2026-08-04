"use client";

import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const title = "Contact — SignSpeak AI";
const description =
  "Talk to the SignSpeak AI team about accessibility partnerships, clinical deployments, custom gesture packs or support.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Contact,
});

const details = [
  { icon: Mail, label: "Email", value: "hello@signspeak.ai" },
  { icon: MessageSquare, label: "Support", value: "Weekdays, 9:00–18:00 CET" },
  { icon: MapPin, label: "Studio", value: "Lisbon · Remote-first team" },
];

function Contact() {
  const [sending, setSending] = useState(false);

  return (
    <div className="min-h-dvh">
      <Navbar />
      <main className="bg-soft">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <h1 className="text-4xl font-semibold text-balance">
              Let's make your space <span className="text-gradient">accessible</span>
            </h1>
            <p className="mt-5 leading-relaxed text-muted-foreground text-pretty">
              Whether you run a clinic, a classroom or a service desk, we'll help you deploy SignSpeak AI and
              train custom gestures for your context.
            </p>

            <ul className="mt-10 space-y-4">
              {details.map((item) => (
                <li key={item.label} className="flex items-center gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-muted-foreground">{item.label}</span>
                    <span className="block truncate text-sm font-medium">{item.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              className="glass-panel rounded-3xl p-7"
              onSubmit={(event) => {
                event.preventDefault();
                setSending(true);
                window.setTimeout(() => {
                  setSending(false);
                  toast("Message sent", { description: "We'll reply within one business day." });
                  (event.target as HTMLFormElement).reset();
                }, 700);
              }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required className="mt-2 h-11" placeholder="Alex Moreau" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required className="mt-2 h-11" placeholder="alex@clinic.org" />
                </div>
              </div>
              <div className="mt-5">
                <Label htmlFor="organisation">Organisation</Label>
                <Input id="organisation" name="organisation" className="mt-2 h-11" placeholder="Riverside Community Clinic" />
              </div>
              <div className="mt-5">
                <Label htmlFor="message">How can we help?</Label>
                <Textarea id="message" name="message" required rows={5} className="mt-2" placeholder="Tell us about your setting and the people you support…" />
              </div>
              <Button type="submit" disabled={sending} className="bg-brand mt-6 h-12 w-full rounded-full text-[15px]">
                {sending ? "Sending…" : "Send message"}
              </Button>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                We never share your details. Replies come from a real person.
              </p>
            </form>
          </Reveal>
        </div>
      </main>
      <Footer />
    </div>
  );
}
