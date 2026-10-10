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
    no: "No",
    "im-okay": "I'm okay",
    water: "Water, please",
    "that-one": "That one",
    "thank-you": "Thank you",
    help: "I need help",
    call: "Please call someone",
    repeat: "Can you repeat that?",
    goodbye: "Goodbye",
    "i-love-you": "I love you",
    three: "Three",
    four: "Four",
    "rock-on": "Rock on",
    vulcan: "Live long and prosper",
    pinch: "A little",
  },
  hi: {
    hello: "नमस्ते",
    yes: "हाँ",
    no: "नहीं",
    "im-okay": "मैं ठीक हूँ",
    water: "पानी चाहिए",
    "that-one": "वह वाला",
    "thank-you": "धन्यवाद",
    help: "मुझे मदद चाहिए",
    call: "कृपया किसी को बुलाइए",
    repeat: "क्या आप दोहरा सकते हैं?",
    goodbye: "अलविदा",
    "i-love-you": "मैं तुमसे प्यार करता हूँ",
    three: "तीन",
    four: "चार",
    "rock-on": "रॉक ऑन",
    vulcan: "दीर्घायु और समृद्धि",
    pinch: "थोड़ा",
  },
};

export function speechLangFor(lang: AppLang): string {
  return APP_LANGS.find((l) => l.id === lang)?.speechLang ?? "en-US";
}

/** Resolve a phrase key, falling back to the English phrase and then the key. */
export function resolvePhrase(phraseKey: string, fallback: string, lang: AppLang): string {
  return PHRASES[lang]?.[phraseKey] ?? PHRASES.en[phraseKey] ?? fallback;
}
