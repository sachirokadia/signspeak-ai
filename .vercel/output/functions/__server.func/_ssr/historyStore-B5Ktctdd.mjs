//#region node_modules/.nitro/vite/services/ssr/assets/historyStore-B5Ktctdd.js
var KEY = "signspeak-history-v1";
var MAX_ENTRIES = 200;
/** Persist gesture history locally so analytics survive reloads. */
function loadHistory() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return [];
		return JSON.parse(raw).map((e) => ({
			...e,
			at: new Date(e.at)
		}));
	} catch {
		return [];
	}
}
function saveHistory(entries) {
	try {
		const stored = entries.slice(0, MAX_ENTRIES).map((e) => ({
			...e,
			at: e.at instanceof Date ? e.at.toISOString() : new Date(e.at).toISOString()
		}));
		localStorage.setItem(KEY, JSON.stringify(stored));
	} catch {}
}
//#endregion
export { saveHistory as n, loadHistory as t };
