"use client";

/**
 * Thin wrapper around the Web Speech API so call-sites stay clean and
 * testable. Speech only ever fires from explicit user-confirmed gestures —
 * never speculatively.
 */

export type SpeakOptions = {
  rate?: number;
  pitch?: number;
  /** BCP-47 language tag, e.g. "en-US" or "hi-IN". */
  lang?: string;
  /** voiceURI of a preferred voice, when the user picked one. */
  voiceURI?: string;
};

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, opts: SpeakOptions = {}): void {
  if (!speechSupported()) return;
  // Don't queue — a new gesture replaces whatever is being spoken.
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = opts.rate ?? 1;
  utterance.pitch = opts.pitch ?? 1;
  if (opts.lang) utterance.lang = opts.lang;
  if (opts.voiceURI) {
    const voice = window.speechSynthesis.getVoices().find((v) => v.voiceURI === opts.voiceURI);
    if (voice) utterance.voice = voice;
  }
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (speechSupported()) window.speechSynthesis.cancel();
}
