# SignSpeak AI — Architecture

## What this is

SignSpeak AI is a browser-based accessibility tool that translates hand
gestures captured by the webcam into text and speech in real time. All
machine-learning inference runs **on-device** — no video frame ever leaves
the browser.

## Pipeline

```
Webcam (getUserMedia)
  → HandLandmarker (MediaPipe Tasks Vision, VIDEO mode, WASM)
      → 21 hand landmarks per frame
  → Landmark normalisation (wrist-centred, scale-invariant features)
  → Rule-based static-gesture classifier (finger-state heuristics)
      → { gesture, phrase, confidence }
  → Gesture Decision Engine
      (stability voting → confidence gating → cooldown)
  → Stable gesture event
      → History + transcript + optional speech synthesis
```

Frames are processed in memory and discarded. The only persisted data is
the user's own gesture history and settings (localStorage/IndexedDB).

## Latency budgets (targets, measured live by the Performance HUD)

| Stage                | Budget   |
| -------------------- | -------- |
| Hand landmark detect | < 40 ms  |
| Classify + decide    | < 5 ms   |
| End-to-end @ 30 fps  | < 50 ms  |

Quote only numbers measured by the HUD on real hardware — never these
targets — in the README or CV.

## Module map

- `src/lib/vision/types.ts` — shared types (landmarks, predictions)
- `src/lib/vision/landmarks.ts` — normalisation + finger-state heuristics
- `src/lib/vision/classifier.ts` — static-gesture template rules
- `src/lib/vision/decisionEngine.ts` — stability voting, gating, cooldown
- `src/lib/vision/handTracker.ts` — MediaPipe HandLandmarker singleton
- `src/lib/vision/trainer.ts` — k-NN few-shot classifier for custom gestures
- `src/lib/vision/customGestures.ts` — IndexedDB persistence + predictor wiring
- `src/lib/speech.ts` — speechSynthesis wrapper
- `src/lib/i18n/phrases.ts` — English/Hindi phrase packs
- `src/lib/settings.ts` — persisted app settings (language)
- `src/lib/historyStore.ts` — localStorage gesture history for analytics
- `src/lib/export.ts` — CSV export for caregivers/therapists
- `src/lib/storage/db.ts` — minimal IndexedDB helper
- `src/hooks/useCamera.ts` — getUserMedia lifecycle + error states
- `src/hooks/useGesturePipeline.ts` — wires camera → tracker → classifier →
  decision engine; exposes prediction, FPS and latency
- `src/hooks/useSpeechRecognition.ts` — Web Speech API for conversation partners
- `src/hooks/useReducedMotion.ts` / `useServiceWorker.ts` — a11y + PWA
- `src/components/dashboard/PerformanceHUD.tsx` — live telemetry overlay
- `src/components/dashboard/PrivacyDashboard.tsx` — verifiable data-flow view
- `src/components/dashboard/SentenceBuilder.tsx` — word-chip sentence composer
- `src/components/dashboard/EmergencyPhrasebook.tsx` — one-tap urgent phrases
- `src/components/dashboard/ExportHistoryButton.tsx` — CSV download
- `src/components/a11y/SkipLink.tsx` — keyboard navigation aid
- `src/components/pwa/OfflineIndicator.tsx` — connectivity banner
- `public/sw.js` — hand-written service worker (model + shell caching)

## Research grounding

- Skeleton-only, on-device recognition: TSLFormer (Ertürk et al., 2025);
  Althubiti & Algethami (2024) on MediaPipe-skeleton transformers
- One-shot custom gestures (Gesture Studio, Phase 3): Shahi et al., Apple,
  UIST 2024; Uboweja et al., Google, 2023
- Gloss-free translation UI ideas (Sentence Builder, Phase 3):
  GASLT (Yin et al., CVPR 2023); GloFE (Lin et al., ACL 2023)
