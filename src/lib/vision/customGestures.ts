"use client";

/**
 * Custom-gesture persistence + predictor wiring.
 *
 * Samples live in IndexedDB (never leave the device). loadCustomPredictor()
 * builds a k-NN classifier over them; the dashboard pipeline consults it for
 * any frame the built-in rules can't classify.
 */
import { deleteByIds, getAll, openDatabase, putAll } from "@/lib/storage/db";
import { KnnClassifier, vectorFromLandmarks, type GestureSample } from "./trainer";
import type { RawPrediction, Vec3 } from "./types";

const DB_NAME = "signspeak-ai";
const DB_VERSION = 1;
const STORE = "custom-gestures";

let dbPromise: Promise<IDBDatabase> | null = null;

function db(): Promise<IDBDatabase> {
  if (!dbPromise) dbPromise = openDatabase(DB_NAME, DB_VERSION, [STORE]);
  return dbPromise;
}

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function saveGestureSamples(label: string, vectors: number[][]): Promise<void> {
  const database = await db();
  const now = Date.now();
  const records: GestureSample[] = vectors.map((vector) => ({
    id: newId(),
    label,
    vector,
    createdAt: now,
  }));
  await putAll(database, STORE, records);
}

export async function listGestureSamples(): Promise<GestureSample[]> {
  return getAll<GestureSample>(await db(), STORE);
}

export async function deleteSamples(ids: string[]): Promise<void> {
  await deleteByIds(await db(), STORE, ids);
}

export type CustomPredictor = (landmarks: Vec3[]) => RawPrediction | null;

/**
 * Returns a predictor over the user's custom gestures, or null when the
 * user hasn't taught any yet.
 */
export async function loadCustomPredictor(): Promise<CustomPredictor | null> {
  const samples = await listGestureSamples();
  if (samples.length === 0) return null;
  const knn = new KnnClassifier(samples);
  return (landmarks: Vec3[]) => {
    const pred = knn.predict(vectorFromLandmarks(landmarks));
    if (!pred || pred.confidence < 0.6) return null;
    return {
      gesture: {
        id: `custom-${pred.label}`,
        label: pred.label,
        phraseKey: pred.label,
        phrase: pred.label,
      },
      confidence: pred.confidence,
      fingerStates: {
        thumb: false,
        index: false,
        middle: false,
        ring: false,
        pinky: false,
      },
    };
  };
}
