"use client";

/**
 * Phrase packs — the spoken/written language of the app.
 *
 * Sign languages differ by region and so do spoken languages: an
 * accessibility tool built in India should speak Hindi as fluently as
 * English. Gesture *detection* is language-independent; only the phrases
 * are localised.
 */

export type AppLang = "en" | "hi";

export const APP_LANGS: { id: AppLang; label: string; speechLang: string }[] = [
  { id: "en", label: "English", speechLang: "en-US" },
  { id: "hi", label: "हिन्दी", speechLang: "hi-IN" },
];

/** Phrase keys used by GestureDefinition.phraseKey. */
export const PHRASES: Record<AppLang, Record<string, string>> = {
  en: {
    hello: "Hello",
    yes: "Yes",
    "im-okay": "I'm okay",
    water: "Water, please",
    "that-one": "That one",
    "thank-you": "Thank you",
    help: "I need help",
    call: "Please call someone",
    repeat: "Can you repeat that?",
    goodbye: "Goodbye",
  },
  hi: {
    hello: "नमस्ते",
    yes: "हाँ",
    "im-okay": "मैं ठीक हूँ",
    water: "पानी चाहिए",
    "that-one": "वह वाला",
    "thank-you": "धन्यवाद",
    help: "मुझे मदद चाहिए",
    call: "कृपया किसी को बुलाइए",
    repeat: "क्या आप दोहरा सकते हैं?",
    goodbye: "अलविदा",
  },
};

export function speechLangFor(lang: AppLang): string {
  return APP_LANGS.find((l) => l.id === lang)?.speechLang ?? "en-US";
}

/** Resolve a phrase key, falling back to the English phrase and then the key. */
export function resolvePhrase(phraseKey: string, fallback: string, lang: AppLang): string {
  return PHRASES[lang]?.[phraseKey] ?? PHRASES.en[phraseKey] ?? fallback;
}
