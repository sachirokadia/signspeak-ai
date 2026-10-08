# SignSpeak AI

An AI-powered accessibility platform that helps non-verbal users communicate
using hand gestures. The app detects gestures through the webcam and converts
them into text and speech in real time — with all inference running
**on-device** in the browser. No video ever leaves the user's machine.

## Features

- **Real-time gesture translation** — MediaPipe hand tracking (21 landmarks)
  with an on-device classifier, stability voting and confidence gating
- **Gesture Decision Engine** — kills frame jitter: a gesture only registers
  after N stable frames above a confidence threshold, with cooldowns
- **Performance HUD** — live FPS and inference-latency telemetry with
  adaptive quality scaling
- **Privacy Mode** — skeleton-landmarks-only pipeline; a dashboard shows the
  data flow and confirms zero bytes uploaded
- **Gesture Studio** — teach the app your own gestures from a few webcam
  samples; models train and persist in-browser (IndexedDB)
- **Sentence Builder** — compose signed sequences into natural sentences
- **Two-way conversation mode** — sign-to-speech one way, speech-to-text
  the other, in a shared transcript
- **Learn mode** — guided practice with live similarity scoring
- **Offline-first PWA** — core gesture loop works without connectivity

## Tech stack

React 19 · TanStack Start · TailwindCSS v4 · Radix UI · TypeScript ·
MediaPipe Tasks Vision (WASM) · Web Speech API · Vite

## Getting started

```sh
git clone https://github.com/sachirokadia/signspeak-ai.git
cd signspeak-ai
npm install
npm run dev
```

Open the dashboard, allow camera access, and hold a gesture steady in frame.

## Scripts

| Command          | What it does              |
| ---------------- | ------------------------- |
| `npm run dev`    | Start dev server          |
| `npm run build`  | Production build          |
| `npm run lint`   | ESLint                    |
| `npx tsc --noEmit` | Type check              |

## Project structure

```
src/
  lib/vision/      # hand tracking, classifier, decision engine
  lib/             # speech, gesture library, utilities
  hooks/           # useCamera, useGesturePipeline
  components/      # dashboard, landing, site, ui
  routes/          # TanStack Start file-based routes
docs/              # architecture and build plan notes
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the pipeline design
and `docs/BUILD_PLAN.md` for the phased implementation plan.

## Roadmap

- [x] Phase 0 — CI, docs, honest audit
- [x] Phase 1 — Real-time on-device pipeline (MediaPipe + classifier + HUD)
- [x] Phase 2 — Privacy mode, accessible UI, offline PWA
- [x] Phase 3 — Gesture Studio, Sentence Builder, two-way conversation
- [x] Phase 4 — Learn mode, caregiver tools, analytics, i18n (EN/HI)

## Accessibility commitment

This is an accessibility product, so it holds itself to the standard:
full keyboard operation, `aria-live` announcements of detected gestures,
reduced-motion support, and WCAG AA contrast.

## Privacy

Webcam frames are processed in memory and discarded. The app works fully
offline after first load. History and custom gestures are stored only on
the user's device.
