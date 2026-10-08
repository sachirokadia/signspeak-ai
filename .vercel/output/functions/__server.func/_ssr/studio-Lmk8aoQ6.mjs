import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { O as FlaskConical, P as CircleStop, a as Trash2, g as Mic, p as Plus } from "../_libs/lucide-react.mjs";
import { r as Navbar, t as Button } from "./Navbar-DqEYdomU.mjs";
import { n as useServiceWorker, t as SkipLink } from "./useServiceWorker-FNXF9_Bm.mjs";
import { r as handTracker, t as WebcamPanel } from "./landmarks-D6NK4_y0.mjs";
import { a as saveGestureSamples, n as deleteSamples, o as vectorFromLandmarks, r as listGestureSamples, t as KnnClassifier } from "./customGestures-DmtUdBqY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studio-Lmk8aoQ6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SAMPLES_PER_GESTURE = 30;
var SAMPLE_INTERVAL_MS = 100;
function StudioPage() {
	const [active, setActive] = (0, import_react.useState)(false);
	const [videoEl, setVideoEl] = (0, import_react.useState)(null);
	const [label, setLabel] = (0, import_react.useState)("");
	const [groups, setGroups] = (0, import_react.useState)([]);
	const [recording, setRecording] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [testing, setTesting] = (0, import_react.useState)(false);
	const [testPred, setTestPred] = (0, import_react.useState)(null);
	const [notice, setNotice] = (0, import_react.useState)("");
	useServiceWorker();
	const refresh = (0, import_react.useCallback)(async () => {
		try {
			const samples = await listGestureSamples();
			const map = /* @__PURE__ */ new Map();
			for (const s of samples) {
				const g = map.get(s.label) ?? {
					label: s.label,
					count: 0,
					ids: []
				};
				g.count += 1;
				g.ids.push(s.id);
				map.set(s.label, g);
			}
			setGroups([...map.values()].sort((a, b) => a.label.localeCompare(b.label)));
		} catch {
			setNotice("Couldn't read saved gestures in this browser.");
		}
	}, []);
	(0, import_react.useEffect)(() => {
		refresh();
	}, [refresh]);
	const handleVideoReady = (0, import_react.useCallback)((video) => {
		setVideoEl(video);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!recording || !videoEl) return;
		let raf = 0;
		let cancelled = false;
		const vectors = [];
		let lastCapture = 0;
		async function boot() {
			try {
				await handTracker.ensureLoaded();
			} catch {
				if (!cancelled) {
					setNotice("Hand-tracking model failed to load.");
					setRecording(false);
				}
				return;
			}
			const tick = () => {
				if (cancelled) return;
				const now = performance.now();
				const res = handTracker.detect(videoEl);
				if (res && now - lastCapture >= SAMPLE_INTERVAL_MS) {
					lastCapture = now;
					vectors.push(vectorFromLandmarks(res.landmarks));
					setProgress(vectors.length / SAMPLES_PER_GESTURE);
				}
				if (vectors.length >= SAMPLES_PER_GESTURE) {
					(async () => {
						try {
							await saveGestureSamples(label.trim(), vectors);
							if (!cancelled) {
								setNotice(`Saved “${label.trim()}” (${vectors.length} samples).`);
								setLabel("");
								refresh();
							}
						} catch {
							if (!cancelled) setNotice("Couldn't save samples in this browser.");
						} finally {
							if (!cancelled) {
								setRecording(false);
								setProgress(0);
							}
						}
					})();
					return;
				}
				raf = requestAnimationFrame(tick);
			};
			tick();
		}
		boot();
		return () => {
			cancelled = true;
			cancelAnimationFrame(raf);
		};
	}, [
		recording,
		videoEl,
		label,
		refresh
	]);
	(0, import_react.useEffect)(() => {
		if (!testing || !videoEl) {
			setTestPred(null);
			return;
		}
		let raf = 0;
		let cancelled = false;
		let lastKey = "";
		async function boot() {
			let knn = null;
			try {
				await handTracker.ensureLoaded();
				const samples = await listGestureSamples();
				if (samples.length === 0) {
					setNotice("Teach a gesture first, then test it.");
					setTesting(false);
					return;
				}
				knn = new KnnClassifier(samples);
			} catch {
				setTesting(false);
				return;
			}
			const tick = () => {
				if (cancelled) return;
				const res = handTracker.detect(videoEl);
				if (res && knn) {
					const pred = knn.predict(vectorFromLandmarks(res.landmarks));
					const key = pred ? `${pred.label}:${Math.round(pred.confidence * 20)}` : "none";
					if (key !== lastKey) {
						lastKey = key;
						setTestPred(pred);
					}
				}
				raf = requestAnimationFrame(tick);
			};
			tick();
		}
		boot();
		return () => {
			cancelled = true;
			cancelAnimationFrame(raf);
		};
	}, [testing, videoEl]);
	const canRecord = active && !!videoEl && !recording && label.trim().length > 0;
	const handleDelete = (0, import_react.useCallback)(async (g) => {
		await deleteSamples(g.ids);
		setNotice(`Deleted “${g.label}”.`);
		refresh();
	}, [refresh]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipLink, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main-content",
				className: "mx-auto max-w-7xl px-5 py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-semibold sm:text-3xl",
						children: "Gesture Studio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-2xl text-sm text-muted-foreground",
						children: "Teach SignSpeak gestures of your own — a name sign, a family sign, anything. Samples never leave this browser; the classifier trains instantly on-device."
					}),
					notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "status",
						className: "mt-4 text-sm text-muted-foreground",
						children: notice
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid gap-5 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WebcamPanel, {
							active,
							onToggle: setActive,
							onVideoReady: handleVideoReady
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									"aria-labelledby": "teach-heading",
									className: "glass-panel rounded-3xl p-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
											id: "teach-heading",
											className: "flex items-center gap-2 text-sm font-semibold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
												className: "h-4 w-4",
												"aria-hidden": "true"
											}), "Teach a new gesture"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: label,
												onChange: (e) => setLabel(e.target.value),
												placeholder: "e.g. \"Mum\", \"medicine\", \"tired\"",
												"aria-label": "Gesture label",
												disabled: recording,
												className: "h-11 min-w-0 flex-1 rounded-full border border-input bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
											}), recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												className: "h-11 rounded-full px-5",
												onClick: () => setRecording(false),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleStop, {
													className: "mr-1.5 h-4 w-4",
													"aria-hidden": "true"
												}), "Stop"]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												className: "h-11 rounded-full px-5",
												disabled: !canRecord,
												onClick: () => {
													setNotice("");
													setProgress(0);
													setRecording(true);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {
													className: "mr-1.5 h-4 w-4",
													"aria-hidden": "true"
												}), "Record"]
											})]
										}),
										recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-2 overflow-hidden rounded-full bg-muted",
												role: "progressbar",
												"aria-valuenow": Math.round(progress * 100),
												"aria-valuemin": 0,
												"aria-valuemax": 100,
												"aria-label": "Recording progress",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-full rounded-full bg-primary transition-[width]",
													style: { width: `${Math.round(progress * 100)}%` }
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-2 text-xs text-muted-foreground",
												children: [
													"Hold the gesture steady — ",
													Math.round(progress * 100),
													"%"
												]
											})]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-2 text-xs text-muted-foreground",
											children: [
												"Start the camera, type a label, then hold the gesture for about 3 seconds while",
												" ",
												SAMPLES_PER_GESTURE,
												" samples are captured."
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									"aria-labelledby": "test-heading",
									className: "glass-panel rounded-3xl p-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
											id: "test-heading",
											className: "flex items-center gap-2 text-sm font-semibold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlaskConical, {
												className: "h-4 w-4",
												"aria-hidden": "true"
											}), "Test your gestures"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: testing ? "outline" : "default",
											className: "h-10 rounded-full px-4",
											disabled: !active || groups.length === 0,
											onClick: () => setTesting((t) => !t),
											children: testing ? "Stop test" : "Start test"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 min-h-10 text-sm",
										role: "status",
										"aria-live": "polite",
										children: !testing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: groups.length === 0 ? "No custom gestures yet." : "Perform a gesture you taught to see it recognised."
										}) : testPred ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: testPred.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: [
												" ",
												"· ",
												Math.round(testPred.confidence * 100),
												"% match"
											]
										})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Show your hand…"
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									"aria-labelledby": "saved-heading",
									className: "glass-panel rounded-3xl p-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										id: "saved-heading",
										className: "text-sm font-semibold",
										children: [
											"Your gestures (",
											groups.length,
											")"
										]
									}), groups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-muted-foreground",
										children: "Nothing saved yet — your gestures will appear here and become available on the dashboard automatically."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-3 flex flex-col gap-2",
										children: groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/60 px-4 py-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: g.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted-foreground",
													children: [
														" · ",
														g.count,
														" samples"
													]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												className: "h-9 w-9 rounded-full",
												"aria-label": `Delete gesture ${g.label}`,
												onClick: () => void handleDelete(g),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
													className: "h-4 w-4",
													"aria-hidden": "true"
												})
											})]
										}, g.label))
									})]
								})
							]
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { StudioPage as component };
