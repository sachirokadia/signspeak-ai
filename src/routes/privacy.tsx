"use client";

import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { PrivacyDashboard } from "@/components/dashboard/PrivacyDashboard";
import { SkipLink } from "@/components/a11y/SkipLink";
import { useServiceWorker } from "@/hooks/useServiceWorker";

const title = "Privacy — SignSpeak AI";
const description =
  "How SignSpeak AI handles your data: on-device inference, zero uploads, local-only storage.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  useServiceWorker();
  return (
    <div className="min-h-dvh bg-soft">
      <SkipLink />
      <Navbar />
      <main id="main-content" className="mx-auto max-w-5xl px-5 py-10">
        <h1 className="text-2xl font-semibold sm:text-3xl">Privacy by architecture</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          SignSpeak AI was designed so there is nothing sensitive to leak: recognition happens
          entirely on your device. This page shows the complete data flow — no fine print.
        </p>
        <div className="mt-8">
          <PrivacyDashboard />
        </div>
      </main>
    </div>
  );
}
