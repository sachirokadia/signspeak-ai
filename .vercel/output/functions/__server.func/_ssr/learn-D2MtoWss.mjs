import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { E as GraduationCap, i as Trophy, u as RotateCcw } from "../_libs/lucide-react.mjs";
import { r as Navbar, t as Button } from "./Navbar-DqEYdomU.mjs";
import { n as useServiceWorker, t as SkipLink } from "./useServiceWorker-FNXF9_Bm.mjs";
import { t as WebcamPanel } from "./landmarks-D6NK4_y0.mjs";
import { n as PerformanceHUD, r as useGesturePipeline, t as GESTURE_DEFINITIONS } from "./useGesturePipeline--wvkKH1P.mjs";
import { i as loadCustomPredictor, r as listGestureSamples } from "./customGestures-DmtUdBqY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/learn-D2MtoWss.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HINTS = {
	"open-palm": "Spread all five fingers wide, palm facing the camera.",
	fist: "Close your hand into a tight fist.",
	"thumbs-up": "Thumb pointing up, other fingers curled in.",
	peace: "Index and middle fingers up in a V, the rest curled.",
	point: "Index finger extended toward the camera, the rest curled.",
	"ok-sign": "Touch your thumb tip to your index fingertip, other fingers up."
};
var BEST_KEY = "signspeak-learn-best-v1";
var DWELL_MS = 2e3;
function loadBest() {
	try {
		return JSON.parse(localStorage.getItem(BEST_KEY) ?? "{}");
	} catch {
		return {};
	}
}
function LearnPage() {
	const [active, setActive] = (0, import_react.useState)(false);
	const [videoEl, setVideoEl] = (0, import_react.useState)(null);
	const [targets, setTargets] = (0, import_react.useState)(() => GESTURE_DEFINITIONS.map((g) => ({
		id: g.id,
		label: g.label,
		hint: HINTS[g.id] ?? "Perform the gesture steadily."
	})));
	const [targetId, setTargetId] = (0, import_react.useState)(GESTURE_DEFINITIONS[0].id);
	const [dwell, setDwell] = (0, import_react.useState)(0);
	const [lastScore, setLastScore] = (0, import_react.useState)(null);
	const [best, setBest] = (0, import_react.useState)({});
	const [customPredict, setCustomPredict] = (0, import_react.useState)(void 0);
	useServiceWorker();
	const target = (0, import_react.useMemo)(() => targets.find((t) => t.id === targetId) ?? targets[0], [targets, targetId]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			try {
				const [samples, predictor] = await Promise.all([listGestureSamples(), loadCustomPredictor()]);
				if (cancelled) return;
				if (predictor) setCustomPredict(() => predictor);
				const labels = [...new Set(samples.map((s) => s.label))];
				if (labels.length > 0) setTargets((prev) => [...prev, ...labels.filter((l) => !prev.some((t) => t.id === `custom-${l}`)).map((l) => ({
					id: `custom-${l}`,
					label: l,
					hint: "Perform the gesture exactly as you taught it."
				}))]);
			} catch {}
		})();
		return () => {
			cancelled = true;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		setBest(loadBest());
	}, []);
	const { live, metrics } = useGesturePipeline(videoEl, active, { customPredict });
	const handleVideoReady = (0, import_react.useCallback)((video) => {
		setVideoEl(video);
	}, []);
	const dwellRef = (0, import_react.useRef)({
		ms: 0,
		confSum: 0,
		confN: 0
	});
	(0, import_react.useEffect)(() => {
		if (!active) return;
		const interval = window.setInterval(() => {
			const d = dwellRef.current;
			if (live?.gesture.id === target.id) {
				d.ms += 100;
				d.confSum += live.confidence;
				d.confN += 1;
				if (d.ms >= DWELL_MS) {
					const score = Math.round(d.confSum / Math.max(d.confN, 1) * 100);
					setLastScore(score);
					setBest((prev) => {
						const next = {
							...prev,
							[target.id]: Math.max(prev[target.id] ?? 0, score)
						};
						try {
							localStorage.setItem(BEST_KEY, JSON.stringify(next));
						} catch {}
						return next;
					});
					d.ms = 0;
					d.confSum = 0;
					d.confN = 0;
				}
			} else d.ms = Math.max(0, d.ms - 200);
			setDwell(d.ms / DWELL_MS);
		}, 100);
		return () => window.clearInterval(interval);
	}, [
		active,
		live,
		target.id
	]);
	const selectTarget = (id) => {
		setTargetId(id);
		dwellRef.current = {
			ms: 0,
			confSum: 0,
			confN: 0
		};
		setDwell(0);
		setLastScore(null);
	};
	const progress = Math.min(1, dwell);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipLink, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main-content",
				className: "mx-auto max-w-7xl px-5 py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "flex items-center gap-2 text-2xl font-semibold sm:text-3xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, {
							className: "h-7 w-7",
							"aria-hidden": "true"
						}), "Learn mode"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-2xl text-sm text-muted-foreground",
						children: "Pick a gesture, then hold it steady in front of the camera until the ring fills. Your best scores are saved on this device."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid gap-5 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WebcamPanel, {
								active,
								onToggle: setActive,
								onVideoReady: handleVideoReady
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerformanceHUD, {
								metrics,
								live,
								active
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								"aria-labelledby": "practice-heading",
								className: "glass-panel rounded-3xl p-6 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										id: "practice-heading",
										className: "text-sm font-semibold text-muted-foreground",
										children: "Now practising"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-3xl font-bold",
										children: target.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mx-auto mt-2 max-w-sm text-sm text-muted-foreground",
										children: target.hint
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative mx-auto mt-5 h-36 w-36",
										role: "progressbar",
										"aria-valuenow": Math.round(progress * 100),
										"aria-valuemin": 0,
										"aria-valuemax": 100,
										"aria-label": `Hold progress for ${target.label}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
											viewBox: "0 0 100 100",
											className: "h-full w-full -rotate-90",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
												cx: "50",
												cy: "50",
												r: "42",
												fill: "none",
												strokeWidth: "10",
												className: "stroke-muted"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
												cx: "50",
												cy: "50",
												r: "42",
												fill: "none",
												strokeWidth: "10",
												strokeLinecap: "round",
												className: "stroke-primary transition-[stroke-dashoffset]",
												strokeDasharray: 2 * Math.PI * 42,
												strokeDashoffset: 2 * Math.PI * 42 * (1 - progress)
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute inset-0 grid place-items-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-2xl font-bold tabular-nums",
												children: [Math.round(progress * 100), "%"]
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex min-h-8 items-center justify-center gap-4 text-sm",
										children: [lastScore !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											role: "status",
											children: ["Last attempt: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: lastScore })]
										}) : null, best[target.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, {
													className: "h-4 w-4",
													"aria-hidden": "true"
												}),
												"Best: ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: best[target.id] })
											]
										}) : null]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "mt-2 rounded-full",
										onClick: () => {
											dwellRef.current = {
												ms: 0,
												confSum: 0,
												confN: 0
											};
											setDwell(0);
											setLastScore(null);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
											className: "mr-1.5 h-3.5 w-3.5",
											"aria-hidden": "true"
										}), "Reset attempt"]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								"aria-labelledby": "pick-heading",
								className: "glass-panel rounded-3xl p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									id: "pick-heading",
									className: "text-sm font-semibold",
									children: [
										"Choose a gesture (",
										targets.length,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3",
									children: targets.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => selectTarget(t.id),
										"aria-pressed": t.id === targetId,
										className: `rounded-2xl border px-3 py-2.5 text-left text-sm transition-colors ${t.id === targetId ? "border-primary bg-primary/10 font-semibold" : "border-border bg-background/60 hover:border-primary/50"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate",
											children: t.label
										}), best[t.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-amber-600 dark:text-amber-400",
											children: ["Best ", best[t.id]]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: "Not tried"
										})]
									}, t.id))
								})]
							})]
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { LearnPage as component };
