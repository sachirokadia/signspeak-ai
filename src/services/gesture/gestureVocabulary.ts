/**
 * gestureVocabulary.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all gesture metadata in the application.
 *
 * Rules enforced by this file:
 *   • Pure module — no React, no DOM, no side effects, no timers.
 *   • No MediaPipe imports — vocabulary is independent of the detection model.
 *   • Imports only from src/services/gesture/types.ts.
 *
 * Migration note:
 *   The gesture names and phrases here deliberately mirror those in
 *   src/lib/gestures.ts (GESTURE_LIBRARY). Once gesture recognition is wired
 *   into the dashboard, the simulation loop in dashboard.tsx will be replaced
 *   by real detections and GESTURE_LIBRARY will be retired. Until then both
 *   files coexist without conflict.
 *
 * Extension points (no changes to this file required):
 *   • Firebase custom packs: call loadCustomVocabulary() at runtime; it merges
 *     entries into the active vocabulary without overwriting built-ins.
 *   • Per-gesture confidence tuning: set minConfidence on any entry.
 *   • Multi-language support: swap phrase values per locale before loading.
 */

import type { VocabularyEntry } from "./types";

// ─── Built-in vocabulary ───────────────────────────────────────────────────────

/**
 * BUILT_IN_VOCABULARY
 * The 10 gestures shipped with the application.
 *
 * gestureId naming convention: lower_snake_case, stable across releases.
 *   Changing a gestureId is a breaking change for any persisted history records
 *   or Firebase custom-gesture packs that reference it by ID.
 *
 * displayName: human-readable label shown in GestureCard and DebugPanel.
 * phrase:      natural-language output sent to TranscriptCard and speech synthesis.
 *
 * minConfidence is omitted here — the global GestureFilterOptions.minConfidence
 * applies. Individual entries can override it when their geometry is ambiguous
 * and requires a higher bar (e.g. a gesture that is easily confused with another).
 */
export const BUILT_IN_VOCABULARY: readonly VocabularyEntry[] = [
  {
    gestureId: "open_palm",
    displayName: "Open Palm",
    phrase: "Hello",
  },
  {
    gestureId: "flat_hand_chin",
    displayName: "Flat Hand → Chin",
    phrase: "Thank you",
  },
  {
    gestureId: "fist_nod",
    displayName: "Fist Nod",
    phrase: "Yes",
  },
  {
    gestureId: "index_middle_tap",
    displayName: "Index + Middle Tap",
    phrase: "Water, please",
  },
  {
    gestureId: "two_hands_rise",
    displayName: "Two Hands Rise",
    phrase: "I need help",
  },
  {
    gestureId: "pinch_draw",
    displayName: "Pinch Draw",
    phrase: "How are you?",
  },
  {
    gestureId: "thumb_out",
    displayName: "Thumb Out",
    phrase: "I'm okay",
  },
  {
    gestureId: "wave",
    displayName: "Wave",
    phrase: "Goodbye",
  },
  {
    gestureId: "cupped_hand",
    displayName: "Cupped Hand",
    phrase: "Can you repeat that?",
  },
  {
    gestureId: "point_forward",
    displayName: "Point Forward",
    phrase: "That one",
  },
] as const;

// ─── Active vocabulary (mutable at runtime, immutable per entry) ───────────────

/**
 * Module-level active vocabulary.
 * Initialised with the built-in entries.
 * Extended at runtime via loadCustomVocabulary() without mutating BUILT_IN_VOCABULARY.
 *
 * Stored as a Map<gestureId, VocabularyEntry> for O(1) lookup.
 * Exported functions are the only public interface — the Map is intentionally
 * not exported, keeping the internal representation an implementation detail.
 */
const _activeVocabulary = new Map<string, VocabularyEntry>(
  BUILT_IN_VOCABULARY.map((entry) => [entry.gestureId, entry]),
);

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * getVocabulary
 * Returns a snapshot of the currently active vocabulary as a readonly array.
 * The array is freshly allocated on each call so callers cannot mutate
 * the internal Map through the return value.
 *
 * Order: built-in entries in declaration order, followed by any custom entries
 * in the order they were loaded.
 */
export function getVocabulary(): readonly VocabularyEntry[] {
  return Array.from(_activeVocabulary.values());
}

/**
 * lookupGesture
 * Returns the VocabularyEntry for the given gestureId, or undefined if the
 * gestureId is not in the active vocabulary.
 *
 * Used by the classifier to resolve a match gestureId back to its full entry
 * (displayName, phrase, minConfidence) after scoring.
 *
 * @param gestureId  Stable snake_case identifier, e.g. "open_palm".
 */
export function lookupGesture(gestureId: string): VocabularyEntry | undefined {
  return _activeVocabulary.get(gestureId);
}

/**
 * loadCustomVocabulary
 * Merges additional VocabularyEntry records into the active vocabulary.
 * Entries with a gestureId that already exists in BUILT_IN_VOCABULARY are
 * rejected and a warning is logged — built-ins cannot be overwritten at
 * runtime to preserve application stability.
 * Entries with a new gestureId are added and immediately available via
 * getVocabulary() and lookupGesture().
 *
 * Intended call sites:
 *   • Firebase custom gesture pack loader (future milestone).
 *   • Test fixtures that need to inject specific vocabulary entries.
 *
 * @param entries  Array of VocabularyEntry records to merge.
 */
export function loadCustomVocabulary(entries: readonly VocabularyEntry[]): void {
  const builtInIds = new Set(BUILT_IN_VOCABULARY.map((e) => e.gestureId));

  for (const entry of entries) {
    if (builtInIds.has(entry.gestureId)) {
      // Built-in gestures cannot be overridden by custom packs.
      // This prevents a malformed Firebase record from silently corrupting
      // core application behaviour.
      console.warn(
        `[gestureVocabulary] Cannot override built-in gesture "${entry.gestureId}". ` +
          "Custom entries must use unique gestureId values.",
      );
      continue;
    }
    _activeVocabulary.set(entry.gestureId, entry);
  }
}

/**
 * resetVocabulary
 * Removes all custom entries and restores the active vocabulary to the
 * built-in set only.
 * Intended for use in tests and settings resets — not called during normal
 * application flow.
 */
export function resetVocabulary(): void {
  _activeVocabulary.clear();
  for (const entry of BUILT_IN_VOCABULARY) {
    _activeVocabulary.set(entry.gestureId, entry);
  }
}
