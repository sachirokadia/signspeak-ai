import { i as normaliseLandmarks } from "./landmarks-D6NK4_y0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customGestures-DmtUdBqY.js
/**
* Minimal promise-based IndexedDB helper. Everything SignSpeak stores —
* custom gesture samples, settings, history — lives here, on-device only.
*/
function openDatabase(name, version, stores) {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(name, version);
		req.onupgradeneeded = () => {
			const db = req.result;
			for (const s of stores) if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: "id" });
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
function putAll(db, store, records) {
	return new Promise((resolve, reject) => {
		const tx = db.transaction(store, "readwrite");
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
		const os = tx.objectStore(store);
		for (const r of records) os.put(r);
	});
}
function getAll(db, store) {
	return new Promise((resolve, reject) => {
		const req = db.transaction(store, "readonly").objectStore(store).getAll();
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
function deleteByIds(db, store, ids) {
	return new Promise((resolve, reject) => {
		const tx = db.transaction(store, "readwrite");
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
		const os = tx.objectStore(store);
		for (const id of ids) os.delete(id);
	});
}
/**
* Few-shot custom-gesture trainer: k-NN over normalised landmark vectors.
*
* Deliberately simple and honest — with 20–40 samples per gesture this is
* surprisingly effective, trains instantly, and every prediction is
* explainable (nearest neighbours). The same normalised feature vector
* defined in landmarks.ts is used, so features stay consistent.
*/
function vectorFromLandmarks(lm) {
	return normaliseLandmarks(lm);
}
function cosineSimilarity(a, b) {
	let dot = 0;
	let na = 0;
	let nb = 0;
	for (let i = 0; i < a.length; i++) {
		const x = a[i];
		const y = b[i];
		dot += x * y;
		na += x * x;
		nb += y * y;
	}
	return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-9);
}
var KnnClassifier = class {
	samples;
	k;
	constructor(samples, k = 5) {
		this.samples = samples;
		this.k = Math.max(1, k);
	}
	get labels() {
		return [...new Set(this.samples.map((s) => s.label))];
	}
	get sampleCount() {
		return this.samples.length;
	}
	predict(vector) {
		if (this.samples.length === 0) return null;
		const scored = this.samples.map((s) => ({
			sample: s,
			sim: cosineSimilarity(vector, s.vector)
		}));
		scored.sort((a, b) => b.sim - a.sim);
		const top = scored.slice(0, Math.min(this.k, scored.length));
		const votes = /* @__PURE__ */ new Map();
		for (const { sample, sim } of top) votes.set(sample.label, (votes.get(sample.label) ?? 0) + Math.max(0, sim));
		let best = null;
		let bestScore = -Infinity;
		for (const [label, score] of votes) if (score > bestScore) {
			best = label;
			bestScore = score;
		}
		if (!best) return null;
		const bestSim = top.find((t) => t.sample.label === best)?.sim ?? 0;
		const confidence = Math.round(Math.max(0, Math.min(1, (bestSim - .75) / .25)) * 100) / 100;
		return {
			label: best,
			confidence
		};
	}
};
/**
* Custom-gesture persistence + predictor wiring.
*
* Samples live in IndexedDB (never leave the device). loadCustomPredictor()
* builds a k-NN classifier over them; the dashboard pipeline consults it for
* any frame the built-in rules can't classify.
*/
var DB_NAME = "signspeak-ai";
var DB_VERSION = 1;
var STORE = "custom-gestures";
var dbPromise = null;
function db() {
	if (!dbPromise) dbPromise = openDatabase(DB_NAME, DB_VERSION, [STORE]);
	return dbPromise;
}
function newId() {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
async function saveGestureSamples(label, vectors) {
	const database = await db();
	const now = Date.now();
	await putAll(database, STORE, vectors.map((vector) => ({
		id: newId(),
		label,
		vector,
		createdAt: now
	})));
}
async function listGestureSamples() {
	return getAll(await db(), STORE);
}
async function deleteSamples(ids) {
	await deleteByIds(await db(), STORE, ids);
}
/**
* Returns a predictor over the user's custom gestures, or null when the
* user hasn't taught any yet.
*/
async function loadCustomPredictor() {
	const samples = await listGestureSamples();
	if (samples.length === 0) return null;
	const knn = new KnnClassifier(samples);
	return (landmarks) => {
		const pred = knn.predict(vectorFromLandmarks(landmarks));
		if (!pred || pred.confidence < .6) return null;
		return {
			gesture: {
				id: `custom-${pred.label}`,
				label: pred.label,
				phraseKey: pred.label,
				phrase: pred.label
			},
			confidence: pred.confidence,
			fingerStates: {
				thumb: false,
				index: false,
				middle: false,
				ring: false,
				pinky: false
			}
		};
	};
}
//#endregion
export { saveGestureSamples as a, loadCustomPredictor as i, deleteSamples as n, vectorFromLandmarks as o, listGestureSamples as r, KnnClassifier as t };
