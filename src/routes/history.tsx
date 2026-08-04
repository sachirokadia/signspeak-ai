import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { GestureHistory } from "@/components/dashboard/GestureHistory";
import { SEED_HISTORY } from "@/lib/gestures";

const title = "History — SignSpeak AI";
const description =
  "Review every translated phrase, its source gesture, confidence score and time — and replay any of them as speech.";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const total = SEED_HISTORY.length;
  const average = Math.round(
    (SEED_HISTORY.reduce((sum, e) => sum + e.confidence, 0) / total) * 100,
  );

  return (
    <div className="min-h-dvh bg-soft">
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 py-14">
        <h1 className="text-3xl font-semibold">Conversation history</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Stored locally on this device. Clear it any time from Settings.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["Phrases translated", String(total)],
            ["Average confidence", `${average}%`],
            ["Storage", "This device only"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="font-display mt-1.5 text-xl font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <GestureHistory entries={SEED_HISTORY} className="mt-6" height="h-[26rem]" />
      </main>
      <Footer />
    </div>
  );
}
