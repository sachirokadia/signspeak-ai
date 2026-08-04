export type GestureSample = {
  gesture: string;
  phrase: string;
};

export const GESTURE_LIBRARY: GestureSample[] = [
  { gesture: "Open Palm", phrase: "Hello" },
  { gesture: "Flat Hand → Chin", phrase: "Thank you" },
  { gesture: "Fist Nod", phrase: "Yes" },
  { gesture: "Index + Middle Tap", phrase: "Water, please" },
  { gesture: "Two Hands Rise", phrase: "I need help" },
  { gesture: "Pinch Draw", phrase: "How are you?" },
  { gesture: "Thumb Out", phrase: "I'm okay" },
  { gesture: "Wave", phrase: "Goodbye" },
  { gesture: "Cupped Hand", phrase: "Can you repeat that?" },
  { gesture: "Point Forward", phrase: "That one" },
];

export type HistoryEntry = {
  id: string;
  gesture: string;
  phrase: string;
  confidence: number;
  at: Date;
};

export const SEED_HISTORY: HistoryEntry[] = [
  { id: "s1", gesture: "Open Palm", phrase: "Hello", confidence: 0.97, at: new Date(Date.now() - 1000 * 60 * 6) },
  { id: "s2", gesture: "Pinch Draw", phrase: "How are you?", confidence: 0.93, at: new Date(Date.now() - 1000 * 60 * 14) },
  { id: "s3", gesture: "Flat Hand → Chin", phrase: "Thank you", confidence: 0.99, at: new Date(Date.now() - 1000 * 60 * 41) },
  { id: "s4", gesture: "Two Hands Rise", phrase: "I need help", confidence: 0.88, at: new Date(Date.now() - 1000 * 60 * 63) },
  { id: "s5", gesture: "Wave", phrase: "Goodbye", confidence: 0.95, at: new Date(Date.now() - 1000 * 60 * 120) },
];

export function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
